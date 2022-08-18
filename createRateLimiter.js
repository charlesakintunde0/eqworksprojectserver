const redis = require('redis');
const redisClient = redis.createClient({no_ready_check: true}); // Create a new
const moment = require('moment')



redisClient.on('connect', function () {
    console.log("Connected to redis")
});
 
redisClient.on('error', function () {
    console.log("Redis crashed ON error.")
 
})


module.exports.rateLimiterMiddleware = (req, res, next) => { 
// User IP Adderess
 const clientIp = req.ip
 console.log(clientIp)

   redisClient.exists(clientIp, (err, reply) => {
     if (err) {
       console.log("Redis not working...")
       system.exit(0)
     }
     if (reply === 1) {

       redisClient.get(clientIp, (err, reply) => {
         
         let data = JSON.parse(reply)
         let currentTime = moment().unix()
         let difference = (currentTime - data.startTime) / 60
         
         if (difference >= 1) {
  
           let body = {
             'count': 1,
             'startTime': moment().unix()
           }
           
           redisClient.set(clientIp, JSON.stringify(body))
           
           next()
         }
         
         if (difference < 1) {
           //block the request
           if (data.count >= 20) {
             let countdown = (60 - ((moment().unix() - data.startTime)))
 
             let timeLeft =  countdown 

            //  return res.status(429).render("rate_limit", timeLeft )
            //  console.log(timeLeft)
            return res.status(429).send(`Your access in now being limited (Too many request!) , try again in ${timeLeft} seconds`)
           }
           
           // update the count and allow the request
           data.count++
           redisClient.set(clientIp, JSON.stringify(data))
           next()
         }
       })
       
     } else {
       console.log("NEW user ADDED")
       // add new user
       let body = {
         'count': 1,
         'startTime': moment().unix()
       }
       redisClient.set(clientIp, JSON.stringify(body))
       // allow request
       next()
     }
   });
  }


// const {RateLimiterPostgres} = require('rate-limiter-flexible');
// const { Pool } = require('pg')
// const dotenv = require('dotenv');
// dotenv.config();

// const  {
//     HEROKUHOST,
//     PGPORT,
//     HEROKUDATABASE,
//     HEROKUUSER,
//     HEROKUPASSWORD, 
// } = process.env



// const connectionString = `postgresql://${HEROKUUSER}:${HEROKUPASSWORD}@${HEROKUHOST}:${PGPORT}/${HEROKUDATABASE}`

// const client = new Pool({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false
//   }
// })

// // const client = new pg.Pool({
// //     user:HEROKUUSER,
// //     host:HEROKUHOST,
// //     database:HEROKUDATABASE,
// //     password:HEROKUPASSWORD,
// //     port:PGPORT
// //   })
  

//   const opts = {
//     storeClient: client,
//     points: 5, // Number of points
//     duration: 1, // Per second(s)
  
//     // Custom options
//     tableName: 'mytable', // if not provided, keyPrefix used as table name
//     keyPrefix: 'myprefix', // must be unique for limiters with different purpose
//   };
  


// const createRateLimiter = async (opts) => {
//   return new Promise((resolve, reject) => {
//     let rateLimiter
//     const ready = (err) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(rateLimiter)
//       }
//     }

//     rateLimiter = new RateLimiterPostgres(opts, ready)
//   })
// }

// module.exports.rateLimiterMiddleware = (res,req,next) => {
// createRateLimiter(opts)
// .then((rateLimiter) => {

//     rateLimiter.consume('userId1')
//       .then((rateLimiterRes) => {
//         // There were enough points to consume
//         res.end(rateLimiterRes.toString())
//       })
//       .catch((rejRes) => {
//         if (rejRes instanceof Error) {
//           // Some Postgres error
//           // Never happen if `insuranceLimiter` set up
//           // res.writeHead(500)
//         } else {
//           // Can't consume
//           // res.writeHead(429);
//         }
//         // res.end(rejRes.toString())
//       });
//   })

// .catch((err) => {
//   console.error(err)
//   process.exit()
// })

// }


  