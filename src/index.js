const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()

const QuizRouter = require('./routes/v1/quiz')
const UserRouter = require('./routes/v1/user')
const ProfileRouter = require('./routes/v1/profile')
const ResetRouter = require('./routes/v1/reset')

const app = express()
const PORT =  process.env.PORT || "3000"
require('./db/index')



const {rateLimitChecker} = require('../lib/utils/rateLimiter')

// app.use((req, res, next ) => {
//   req.headers['access-control-allow-origin'] = '*'
//   req.headers['access-control-allow-credentials'] = true
//   req.headers['access-control-allow-headers'] = '*'
//   req.headers['access-control-allow-methods'] = '*'
//   req.headers['access-control-expose-headers'] = '*'
//   next()
// })


app.use(cors(
  {
    origin: 'https://render.com',
    credentials: true,
    methods: '*'
  }
))


app.use(express.json())
app.use(express.urlencoded())



app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 604_800_000}, // seven days
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })    
}))

app.use((req, res, next) => {
  console.log(req.method, req.url, req.query)
  next()
})

// rate limit
app.use(rateLimitChecker)





app.use("/api/v1", QuizRouter)
app.use("/api/v1/user", UserRouter)
app.use('/api/v1/profile', ProfileRouter)
app.use('/api/v1/reset', ResetRouter)

app.listen(PORT, () => console.log(`connected to post ${PORT}`))
