const { Router } = require('express')

const getSession = require('../../controller/user/getSession')
const signup = require('../../controller/user/signup')
const signin = require('../../controller/user/signin')
const signout = require('../../controller/user/signout')




const router = Router()

router.get('/session', getSession)
router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', signout)



module.exports = router






