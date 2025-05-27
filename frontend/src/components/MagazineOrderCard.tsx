import { Card, Typography, Row, Col, Divider } from 'antd';
import { EnvironmentOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import type { Order } from '../types';

const { Text } = Typography;

interface MagazineOrderCardProps {
  order: Order;
}

export default function MagazineOrderCard({ order }: MagazineOrderCardProps) {
  const totalCopies = order.itens_pedido ? order.itens_pedido.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <Card
      className="mb-6 rounded-lg shadow-md max-w-96 w-full"
    >
      {/* Informações do Pedido */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <EnvironmentOutlined className="text-lg mr-2 text-blue-500" />
          <Text strong className="text-base">{order.congregation}</Text>
        </div>

        <Text type="secondary" className="block mb-1">Região: {order.region}</Text>

        <Text type="secondary" className="block mb-1">
          <UserOutlined className="mr-1" />
          Líder: {order.leader}
        </Text>

        <Text type="secondary" className="block mb-1">
          <UserOutlined className="mr-1" />
          Responsável Depto: {order.department_head}
        </Text>
        
        {order.phone && (
          <Text type="secondary" className="block mb-0">
            <PhoneOutlined className="mr-1" />
            Telefone: {order.phone}
          </Text>
        )}
      </div>

      <Divider orientation="left" className="my-4">
        <Text strong type="secondary" className="text-xs">ITENS DO PEDIDO</Text>
      </Divider>

      {/* Itens do Pedido */}
      {order.itens_pedido && order.itens_pedido.length > 0 ? (
        order.itens_pedido.map((item, index: number) => (
          <Row key={item.id || index} align="middle" className="mb-2">
            <Col span={18}>
              <Text strong>{item.magazine}</Text>
            </Col>
            <Col span={6} className="text-right">
              <Text strong>{item.quantity}</Text>
              <br />
              <Text type="secondary" className="text-xs">cópias</Text>
            </Col>
          </Row>
        ))
      ) : (
        <Text type="secondary">Nenhum item de pedido encontrado.</Text>
      )}

      {/* Total */}
      <Divider className="my-4" />
      <Row align="middle">
        <Col span={18}>
          <Text strong>Total de Cópias:</Text>
        </Col>
        <Col span={6} className="text-right">
          <Text strong>{totalCopies} cópias</Text>
        </Col>
      </Row>
    </Card>
  );
}