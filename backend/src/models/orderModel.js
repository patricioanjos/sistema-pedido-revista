import sql from '../../db.js'

const orderModel = {
    async getAllOrders() {
        return await sql`
      SELECT
        p.id,
        p.region,
        p.congregation,
        p.data,
        p.leader,
        p.department_head,
        p.phone,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ip.id,
              'magazine', ip.magazine,
              'quantity', ip.quantity
            )
          ) FILTER (WHERE ip.id IS NOT NULL),
          '[]'::json
        ) AS itens_pedido
      FROM
        pedidos AS p
      LEFT JOIN
        itens_pedido AS ip ON p.id = ip.order_id
      GROUP BY
        p.id, p.region, p.congregation, p.data, p.leader, p.department_head, p.phone
      ORDER BY
        p.id;
    `;
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