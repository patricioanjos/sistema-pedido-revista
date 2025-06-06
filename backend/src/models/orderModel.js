import sql, { supabase } from '../../db.js'

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

    const { data: newOrderData, error: insertOrderError } = await supabase
      .from('pedidos')
      .insert({
        region,
        congregation,
        leader,
        department_head: departmentHead,
        phone,
      })
      .select('id')
      .single() // Espera um único registro de volta

    if (insertOrderError) {
      console.error('Erro Supabase ao criar pedido:', insertOrderError)
      // Se o erro for de RLS
      if (insertOrderError.code === '42501') {
        throw new Error('Acesso negado: Pedidos estão desativados.')
      }
      throw new Error(insertOrderError.message)
    }

    const orderId = newOrderData.id

    if (magazines?.length > 0) {
      const itemsToInsert = magazines.map(magazine => ({
        order_id: orderId,
        magazine: magazine.type,
        quantity: magazine.quantity
      }))

      const { error } = await supabase
        .from('itens_pedido')
        .insert(itemsToInsert)

      if (error) {
        console.error('Erro Supabase ao inserir itens do pedido:', error)
        throw new Error(error.message)
      }
    }

    return orderId
  }
}

export default orderModel