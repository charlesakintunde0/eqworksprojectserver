const ms = require('ms');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');
const requestIp = require('request-ip');

  module.exports.apiSource =  (req, res) => {
    res.send('Welcome to EQ Works 😎')
  }

  module.exports.eventsHourly = (req, res, next) => {
    req.sqlQuery = `
      SELECT date, hour, events, poi_id
      FROM public.hourly_events
      ORDER BY date, hour
      LIMIT 168;
    `

    console.log(req.ip)
    return next()
  }

  module.exports.eventsDaily = (req, res, next) => {
    req.sqlQuery = `
      SELECT date, SUM(events) AS events
      FROM public.hourly_events
      GROUP BY date
      ORDER BY date
      LIMIT 7;
    `
    return next()
  }


  module.exports.statsHourly =(req, res, next) => {
    req.sqlQuery = `
      SELECT date, hour, impressions, clicks, revenue, poi_id
      FROM public.hourly_stats
      ORDER BY date, hour
      LIMIT 168;
    `
    return next()
  }
  
  module.exports.statsDaily =(req, res, next) => {
    req.sqlQuery = `
      SELECT date,
          SUM(impressions) AS impressions,
          SUM(clicks) AS clicks,
          SUM(revenue) AS revenue
      FROM public.hourly_stats
      GROUP BY date
      ORDER BY date
      LIMIT 7;
    `
    return next()
  }
  
  module.exports.poi = (req, res, next) => {
    req.sqlQuery = `
      SELECT *
      FROM public.poi;
    `
    return next()
  }
  
  
  
  
  module.exports.eventsPoi = (req,res,next) => {
    req.sqlQuery = `
      SELECT date,SUM(events) AS events,lat,lon,name
      FROM public.hourly_events
      JOIN public.poi USING(poi_id)
      GROUP BY date,lat,lon,name
      ORDER BY date
      LIMIT 24
   
    `
    return next()
  }
  
  module.exports.statsPoi = (req,res,next) => {
    req.sqlQuery = `
      SELECT date,name,
      SUM(impressions) AS impressions,
      SUM(clicks) AS clicks,
      SUM(revenue) AS revenue,
      lat,
      lon
      FROM public.hourly_stats
      JOIN public.poi USING(poi_id)
      GROUP BY date,lat,lon,name
      ORDER BY date
      LIMIT 24
    `
    return next()
  }


