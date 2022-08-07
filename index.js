const cors = require('cors');
const express = require('express')
const router = require('./routes');
const app = express()
const { customRedisRateLimiter} = require('./rateLimiter')


// app.use(customRedisRateLimiter)
app.use('/', cors() ,router)
app.use(cors())
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("trust proxy", true);


app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
