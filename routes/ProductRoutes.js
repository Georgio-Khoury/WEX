const {Router} = require('express')
const router = Router()
const {requireAuth} = require('../middleware/authControl')
const product = require('../controllers/ProductControllers')
const {upload} = require('../multerconfig/multerconfig')


router.post('/api/edititem',requireAuth,product.edititems)
router.get('/api/myitems',requireAuth,product.myitems)
router.get('/api/getitems',requireAuth,product.getitems)
router.post('/api/additem',requireAuth,upload,product.additem)
router.delete('/api/deleteitem',requireAuth,product.deleteitem)

module.exports =  router