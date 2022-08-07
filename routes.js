const express = require("express");
const router = express.Router();
const {apiSource,eventsHourly,eventsDaily,statsDaily,statsHourly,eventsPoi,statsPoi,poi} = require('./controllers')
const { rateLimiter } = require('./rateLimiter')
const pg = require('pg')
const dotenv = require('dotenv');
dotenv.config();

const  {
    PGHOST,
    PGPORT,
    PGDATABASE,
    PGUSER,
    PGPASSWORD, 
} = process.env


const pool = new pg.Pool({
    user:PGUSER,
    host:PGHOST,
    database:PGDATABASE,
    password:PGPASSWORD,
    port:PGPORT
  })
  
const queryHandler = (req, res, next) => {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  } 

router.get('/',apiSource)
router.get('/events/hourly',eventsHourly,queryHandler)
router.get('/events/daily',eventsDaily,queryHandler)
router.get('/stats/daily',statsDaily,queryHandler)
router.get('/stats/hourly',statsHourly,queryHandler)
router.get('/events/poi',eventsPoi,queryHandler)
router.get('/stats/poi',statsPoi,queryHandler)
router.get('/poi',poi,queryHandler)


module.exports = router;