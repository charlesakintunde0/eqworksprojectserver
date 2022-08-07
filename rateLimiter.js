// const redisClient = require("./redis");
// const moment = require('moment')


const redis = require('redis')
const redisClient = redis.createClient()
const moment = require('moment')

module.exports.rateLimiter = (req,res,next) => {
  redisClient.exists(req.headers.user,(err,reply) => {
    if(err) {
      console.log("Redis not working...")
      system.exit(0)
    }
    if(reply === 1) {
      // user exists
      // check time interval
      redisClient.get(req.headers.user,(err,reply) => {
        let data = JSON.parse(reply)
        let currentTime = moment().unix()
        let difference = (currentTime - data.startTime)/60
        if(difference >= 1) {
          let body = {
            'count': 1,
            'startTime': moment().unix()
          }
          redisClient.set(req.headers.user,JSON.stringify(body))
          // allow the request
          next()
        }
        if(difference < 1) {
          if(data.count > 3) {
            return res.json({"error": 1, "message": "throttled limit exceeded..."})
          }
          // update the count and allow the request
          data.count++
          redisClient.set(req.headers.user,JSON.stringify(data))
          // allow request
          next()
        }
      })
    } else {
      // add new user
      let body = {
        'count': 1,
        'startTime': moment().unix()
      }
      redisClient.set(req.headers.user,JSON.stringify(body))
      // allow request
      next()
    }
  })
}
// module.exports.rateLimiter = async (req, res, next) => {
//     const ip = req.connection.remoteAddress;

//     const response = await redisClient.multi().incr(ip).expire(ip, 600).exec()
//     console.log(response)
//     // [response] = await redisClient
//     //   .multi()
//     //   .incr(ip)
//     //   .expire(ip, secondsLimit)
//     //   .exec();

//     // if (response[1] > limitAmount)
//     //   res.json({
//     //     loggedIn: false,
//     //     status: "Slow down!! Try again in a minute.",
//     //   });
//     // else next();

//     next()
//   };



// const RedisServer = require('redis-server');

// // Simply pass the port that you want a Redis server to listen on.
// const server = new RedisServer();

// server.open((err) => {
//   if (err === null) {
//     // You may now connect a client to the Redis
//     // server bound to port 6379.
//   }
// });

// //---------------------
// module.exports.rateLimiter = (req, res, next) => {
  
//   //CHECK FOR EXISTING KEYS ON REDIS
  
//   // redisClient.keys('*', function (err, keys) {
//   //   if (err) return console.log(err);
//   //   console.log("keys are >>>>>>>> ", keys)
//   // });       
  
  

//   //POSSIBLE UNIQUE KEYS
//   //req.ip REFERS TO WIFI IP, NOT MACHINE IP
  
//   // redisClient.exists(req.headers.user, (err, reply) => {
//   // redisClient.exists("user1", (err, reply) => {

//     const ip = req.connection.remoteAddress;
//   redisClient.exists(ip, (err, reply) => {
//     if (err) {
//       console.log("Redis not working...")
//       system.exit(0)
//     }
//     if (reply === 1) {
//       // user exists
//       // check time interval
      
//       redisClient.get(ip, (err, reply) => {
        
//         let data = JSON.parse(reply)
//         console.log(" ACCESSES >>>>>>>>>>>>>>", data)
//         let currentTime = moment().unix()
//         let difference = (currentTime - data.startTime) / 60
        
//         if (difference >= 1) {
//           // allow the request
//           let body = {
//             'count': 1,
//             'startTime': moment().unix()
//           }
          
//           redisClient.set(ip, JSON.stringify(body))
          
//           next()
//         }
        
//         if (difference < 1) {
//           //block the request
//           if (data.count >= 20) {
//             let countdown = (60 - ((moment().unix() - data.startTime)))

//             let timeLeft = {"time": countdown} 

//             //original code
//             // return res.json({ "error": 1, "message": "throttled limit exceeded..." }) 

//             //suggested status 426
//             // return res.status(426).json({ "error": 1, "message": "throttled limit exceeded..." }) 

//             //proper status 429
//             // return res.status(429).json({ "error": 1, "retry in": `${countdown} seconds`, "message": "throttled limit exceeded..."})
//             return res.status(429).render("rate_limit", timeLeft )
//           }
          
//           // update the count and allow the request
//           data.count++
//           redisClient.set(ip, JSON.stringify(data))
//           next()
//         }
//       })
      
//     } else {
//       console.log("added new user")
//       // add new user
//       let body = {
//         'count': 1,
//         'startTime': moment().unix()
//       }
//       redisClient.set(req.ip, JSON.stringify(body))
//       // allow request
//       next()
//     }
//   })
// }