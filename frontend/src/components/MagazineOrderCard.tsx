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
      className="mb-6 rounded-lg shadow-md w-full border border-gray-300"
    >
      <div className="flex flex-col md:flex-row md:space-x-4">
        
        <div className="mb-4 md:mb-0 md:w-1/2">
          <div className="flex items-center mb-2">
            <EnvironmentOutlined className="text-lg mr-2 text-blue-500" />
            <Text strong className="text-lg">{order.congregation}</Text>
          </div>

          <Text type="secondary" className="block mb-1 text-base">Região: {order.region}</Text>

          <Text type="secondary" className="block mb-1 text-base capitalize">
            <UserOutlined className="mr-1" />
            Dirigente: {order.leader}
          </Text>

          <Text type="secondary" className="block mb-1 text-base capitalize">
            <UserOutlined className="mr-1" />
            Líder departamento: {order.department_head}
          </Text>

          {order.phone && (
            <Text type="secondary" className="block text-base mb-0">
              <PhoneOutlined className="mr-1" />
              Telefone: {order.phone}
            </Text>
          )}
        </div>

        {/*  */}
        <div className="md:w-1/2">
          <Divider orientation="left" size='large' className="my-4 md:hidden">
            <Text strong type="secondary" className="text-base">ITENS DO PEDIDO</Text>
          </Divider>

          {order.itens_pedido && order.itens_pedido.length > 0 ? (
            order.itens_pedido.map((item, index: number) => (
              <div key={item.id || index} className="flex items-center justify-between mb-2">
                <div>
                  <Text strong className="text-base capitalize">{item.magazine.replace(/_/g, ' ')}</Text>
                </div>
                <div className="text-right">
                  <Text strong className="text-lg">{item.quantity}</Text>
                  <br />
                  <Text type="secondary" className="text-xs">cópias</Text>
                </div>
              </div>
            ))
          ) : (
            <Text type="secondary">Nenhum item de pedido encontrado.</Text>
          )}
        </div>
      </div>

      <Divider className="my-4" />
      <Row align="middle">
        <Col span={18}>
          <Text strong className="text-base">Total de Cópias:</Text>
        </Col>
        <Col span={6} className="text-right">
          <Text strong className="text-lg">{totalCopies} cópias</Text>
        </Col>
      </Row>
    </Card>
  );
}