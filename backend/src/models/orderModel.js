import sql from '../../db.js'

const orderModel = {
    async getAllOrders() {
        return await sql`SELECT * FROM pedidos`;
    },

    async createOrder(orderData) {
        const { region, congregation, leader, departmentHead, phone, magazines } = orderData

        console.log(orderData)

        const [order] = await sql`
            INSERT INTO pedidos (region, congregation, leader, department_head, phone)
            VALUES (${region}, ${congregation}, ${leader}, ${departmentHead}, ${phone})
            RETURNING id
        `;

        const orderId = order.id

        // Inserir os itens relacionados
        for (const magazine of magazines) {
            await sql`
                INSERT INTO itens_pedido (order_id, magazine, quantity)
                VALUES (${orderId}, ${magazine.type}, ${magazine.quantity})
            `;
        }

        return orderId
    }
}

export default orderModel