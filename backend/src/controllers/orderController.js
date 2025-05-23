import orderModel from "../models/orderModel.js";

const orderController = {
    async getAllOrders(req, res) {
        try {
            const orders = await orderModel.getAllOrders()
            res.status(200).json(orders)
        } catch(error) {
            console.error('Erro ao buscar pedidos' + error)
            res.status(500).json({ error: 'Erro ao buscar pedidos' })
        }
    },

    async createOrder(req, res) {
        try {
            const orderData = req.body;
            const orderId = await orderModel.createOrder(orderData);
            res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId: orderId });
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({ error: 'Erro ao criar pedido' });
        }
    }
}

export default orderController