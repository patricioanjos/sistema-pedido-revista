import express from 'express';
import orderController from './controllers/orderController.js';
import userController from './controllers/userController.js';
import { verifyAutheticationToken } from './middleware/authMiddleware.js';
import settingsController from './controllers/settingsController.js';

const router = express.Router()

router.get('/orders', verifyAutheticationToken, orderController.getAllOrders)
router.get('/settings', settingsController.getStatus)

router.post('/orders', orderController.createOrder)
router.post('/login', userController.loginUser)
router.patch('/settings', verifyAutheticationToken, settingsController.updateStatus)

export default router