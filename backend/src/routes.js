import express from 'express';
import orderController from './controllers/orderController.js';

const router = express.Router()

router.get('/orders', orderController.getAllOrders)

router.post('/orders', orderController.createOrder)

export default router