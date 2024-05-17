const {Router} = require('express')
const router = Router()
const {requireAuth} = require('../middleware/authControl')
const chat = require('../controllers/ChatControllers')

router.get('/api/getchats',requireAuth,chat.getchats)
router.post('/api/getid',requireAuth,chat.getid)
router.get('/api/getmessages',requireAuth,chat.getmessages)

module.exports = router