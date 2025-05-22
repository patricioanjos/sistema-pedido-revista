import express from "express";
import sql from '../db.js'

const router = express.Router()

router.post('/order', async (req, res) => {
  try {
    const { regiao, congregacao, data, nome_dirigente, lider_departamento, telefones, revistas } = req.body;

    console.log(req.body)

    const pedidoResult = await sql`
      INSERT INTO pedidos (regiao, congregacao, data, nome_dirigente, lider_departamento, telefone)
      VALUES (${regiao}, ${congregacao}, ${data}, ${nome_dirigente}, ${lider_departamento}, ${telefones})
      RETURNING id
    `;

    const pedidoId = pedidoResult[0].id;
    console.log(pedidoId)

    for (let revista of revistas) {
      await sql`
        INSERT INTO itens_pedido (pedido_id, revista, quantidade)
        VALUES (${pedidoId}, ${revista.tipo}, ${revista.quantidade})
      `;
    }

    res.status(201).json({ message: 'Pedido criado com sucesso!', pedidoId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

export default router