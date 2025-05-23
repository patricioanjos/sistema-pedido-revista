import sql from '../../db.js'

const orderModel = {
    async getAllOrders() {
        return await sql`SELECT * FROM pedidos`;
    },

    async createOrder(orderData) {
        const { regiao, congregacao, data, nome_dirigente, lider_departamento, telefones, revistas } = orderData

        console.log(orderData)

        const [order] = await sql`
            INSERT INTO pedidos (regiao, congregacao, data, nome_dirigente, lider_departamento, telefone)
            VALUES (${regiao}, ${congregacao}, ${data}, ${nome_dirigente}, ${lider_departamento}, ${telefones})
            RETURNING id
        `;

        const orderId = order.id

        // Inserir os itens relacionados
        for (const revista of revistas) {
            await sql`
                INSERT INTO itens_pedido (pedido_id, revista, quantidade)
                VALUES (${orderId}, ${revista.tipo}, ${revista.quantidade})
            `;
        }

        return orderId
    }
}

export default orderModel