const Rate_Limit = require('../../src/db/Schema/RateLimitSchema')

async function rateLimitChecker(req, res, next) {


  const ip = req.socket.remoteAddress
  console.log(req.headers['x-forwarded-for'])

  // cookie timeout from cookie
  if(req.cookies?.timeOut) {
      res.status(408).send({message: 'too many request'})

    } else {
      const rateLimit  = await Rate_Limit.findOneAndUpdate(
        {ip: ip},
        {$inc: {requestTimes: req.method === 'GET' ? 1 : 5}}      
      )
     if (!rateLimit) {
      const newRateLimit = new Rate_Limit({ip: ip})
    
      try {
        await Rate_Limit.create(newRateLimit)
      } catch (error) {
        console.log(error)
      }
      next()
      
     } else {
      const maxRequest = 180
      if (rateLimit.requestTimes > maxRequest) {
        // timeout cookie created
        res.cookie('timeOut', 'wait for a minute', {maxAge: 60_000, httpOnly: true})
        // server side timeout, only triggers once
        res.status(408).send({message: 'too many request'})
  
      } else {
        next()
      }
     }
    }

  

}

module.exports = {rateLimitChecker}