import { useEffect, useState } from "react";
import MagazineOrderCard from "../components/MagazineOrderCard";
import axios from "axios";
import type { Order } from "../types";
import { Alert, Collapse, Layout, Spin, Typography, type CollapseProps } from "antd";

const { Title } = Typography;
const { Content } = Layout;

export default function Dashboard() {
    const [allOrders, setAllOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setError(null); // Limpa erros anteriores

                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`);

                // Verifica se a resposta tem dados antes de definir
                if (response.data) {
                    setAllOrders(response.data);
                } else {
                    throw new Error("Dados da API vazios ou inválidos.");
                }
            } catch (err: any) {
                console.error("Erro ao buscar pedidos:", err);
                setError(err.message || "Ocorreu um erro ao buscar os pedidos.");
            } finally {
                setLoading(false)
            }
        };

        fetchOrders();
    }, []); // Array de dependências vazio: executa apenas uma vez no montante do componente

    const eastOrders = allOrders.filter((order) => order.region?.toLowerCase() === 'leste');
    const northOrders = allOrders.filter((order) => order.region?.toLowerCase() === 'norte');
    const southOrders = allOrders.filter((order) => order.region?.toLowerCase() === 'sul');

    // Calcular totais para o cabeçalho
    const totalOrdersCount = allOrders.length;
    const totalMagazineCopies = allOrders.reduce((acc, order) => {
        // Garanta que 'itens_pedido' exista e seja um array
        const orderItems = order.itens_pedido || [];
        const orderCopies = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        return acc + orderCopies;
    }, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-10">
                <Alert
                    message="Erro ao carregar dados"
                    description={`Não foi possível carregar os pedidos: ${error}`}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // Criação dos itens do Collapse manualmente para cada região
    const collapseItems: CollapseProps['items'] = [

        eastOrders.length > 0 && {
            key: 'leste',
            label: (
                <div className="flex justify-between items-center h-16 px-3 bg-blue-50 border-2 border-blue-200 
                rounded-lg">
                    <h2 className="text-2xl font-semibold">Região Leste</h2>
                    <p className="text-blue-600">{eastOrders.length} Pedidos</p>
                </div>
            ),
            children: (
                <section className="grid lg:grid-cols-2 gap-x-8 pl-6">
                    {eastOrders.map((order: Order) => (
                        <MagazineOrderCard order={order} key={order.id} />
                    ))}
                </section>
            ),
            className: 'mb-4',
        },

        northOrders.length > 0 && {
            key: 'norte',
            label: (
                <div className="flex justify-between items-center h-16 px-3 bg-green-50 border-2 border-green-200 
                rounded-lg">
                    <h2 className="text-2xl font-semibold">Região Norte</h2>
                    <p className="text-green-600">{northOrders.length} Pedidos</p>
                </div>
            ),
            children: (
                <section className="grid lg:grid-cols-2 gap-x-8 pl-6">
                    {northOrders.map((order: Order) => (
                        <MagazineOrderCard order={order} key={order.id}/>
                    ))}
                </section>
            ),
            className: 'mb-4',
        },

        southOrders.length > 0 && {
            key: 'sul',
            label: (
                <div className="flex justify-between items-center h-16 px-3 bg-orange-50 border-2 border-orange-200 
                rounded-lg">
                    <h2 className="text-2xl font-semibold">Região Sul</h2>
                    <p className="text-orange-600">{southOrders.length} Pedidos</p>
                </div>
            ),
            children: (
                <section className="grid lg:grid-cols-2 gap-x-8 pl-6">
                    {southOrders.map((order: Order) => (
                        <MagazineOrderCard order={order} key={order.id} />
                    ))}
                </section>
            ),
            className: 'mb-4',
        },
    ].filter(Boolean) as CollapseProps['items']

    return (
        <main className="min-h-screen">
            <Title level={2} className="m-0 leading-[64px] text-center">
                Pedidos de Revistas
            </Title>


            <Content>
                {collapseItems.length > 0 ? (
                    <Collapse
                        items={collapseItems}
                        ghost
                    />
                ) : (
                    <Alert message="Nenhum pedido encontrado para exibir." type="info" showIcon className="mt-8" />
                )}
            </Content>
        </main>
    );
}