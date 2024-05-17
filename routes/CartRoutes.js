const cart = require('../controllers/CartControllers')
const {Router} = require('express')
const router = Router()
const {requireAuth} = require('../middleware/authControl')



router.get('/api/cartstatus',requireAuth,cart.cartstatus)
router.post('/api/addcart',requireAuth,cart.addcart)
router.delete('/api/deletecart',requireAuth,cart.deletecart)
router.get('/api/getcart',requireAuth,cart.getcart)

module.exports =  router
