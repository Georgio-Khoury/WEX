const {Router} = require('express')
const router = Router()
const {requireAuth} = require('../middleware/authControl')
const user = require('../controllers/UserControllers')
const {upload} = require('../multerconfig/multerconfig')

router.post('/api/edituser',requireAuth,user.edituser)
router.post('/api/adduser',upload,user.adduser)
router.get('/api/login/:email',user.login)


module.exports = router