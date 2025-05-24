import express from 'express';
import orderController from './controllers/orderController.js';
import userController from './controllers/userController.js';

const router = express.Router()

router.get('/orders', orderController.getAllOrders)

router.post('/orders', orderController.createOrder)
router.post('/login', userController.loginUser)

export default router