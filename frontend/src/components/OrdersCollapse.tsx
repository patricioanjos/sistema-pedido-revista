import { CodeSandboxOutlined, ReadOutlined } from "@ant-design/icons";
import { Alert, Collapse, Spin, type CollapseProps } from "antd";
import MagazineOrderCard from "./MagazineOrderCard";
import type { Order } from "../types";
import { calculateTotalCopies } from "../utils/calculateCopies";

interface Props {
    allOrders: Order[]
    filteredOrders: Order[]
    loading: boolean
    error: string | null
}

export default function OrdersCollapse({filteredOrders, loading, error}: Props) {

    const eastOrders = filteredOrders.filter((order) => order.region?.toLowerCase() === 'leste');
    const northOrders = filteredOrders.filter((order) => order.region?.toLowerCase() === 'norte');
    const southOrders = filteredOrders.filter((order) => order.region?.toLowerCase() === 'sul');

    const totalEastMagazinesCopies = calculateTotalCopies(eastOrders)
    const totalNorthMagazinesCopies = calculateTotalCopies(northOrders)
    const totalSouthMagazinesCopies = calculateTotalCopies(southOrders)

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

        {
            key: 'leste',
            label: (
                <div className="flex justify-between items-center h-16 px-3 bg-blue-50 border-2 border-blue-200 
                rounded-lg">
                    <h2 className="text-2xl font-semibold">Região Leste</h2>
                    <div className="space-x-4 text-gray-500 text-base">
                        <span><CodeSandboxOutlined />{eastOrders.length} Pedidos</span>
                        <span><ReadOutlined /> {totalEastMagazinesCopies} Cópias</span>
                    </div>
                </div>
            ),
            children: (
                eastOrders?.length ? (
                    <section className="grid lg:grid-cols-2 gap-x-8 pl-6">
                        {eastOrders.map((order: Order) => (
                            <MagazineOrderCard order={order} key={order.id} />
                        ))}
                    </section>
                ) : <Alert message="Nenhum pedido encontrado para exibir." type="info" showIcon className="ml-6" />
            ),
            className: 'mb-4',
        },

        {
            key: 'norte',
            label: (
                <div className="flex justify-between items-center h-16 px-3 bg-green-50 border-2 border-green-200 
                rounded-lg">
                    <h2 className="text-2xl font-semibold">Região Norte</h2>
                    <div className="space-x-4 text-gray-500 text-base">
                        <span><CodeSandboxOutlined />{northOrders.length} Pedidos</span>
                        <span><ReadOutlined /> {totalNorthMagazinesCopies} Cópias</span>
                    </div>
                </div>
            ),
            children: (
                northOrders?.length ? (
                    <section className="grid lg:grid-cols-2 gap-x-8 pl-6">
                        {northOrders.map((order: Order) => (
                            <MagazineOrderCard order={order} key={order.id} />
                        ))}
                    </section>
                ) : <Alert message="Nenhum pedido encontrado para exibir." type="info" showIcon className="ml-6" />
            ),
            className: 'mb-4',
        },

        {
            key: 'sul',
            label: (
                <div className="flex justify-between items-center h-16 px-3 bg-orange-50 border-2 border-orange-200 
                rounded-lg">
                    <h2 className="text-2xl font-semibold">Região Sul</h2>
                    <div className="space-x-4 text-gray-500 text-base">
                        <span><CodeSandboxOutlined />{southOrders.length} Pedidos</span>
                        <span><ReadOutlined /> {totalSouthMagazinesCopies} Cópias</span>
                    </div>
                </div>
            ),
            children: (
                southOrders?.length ? (
                    <section className="grid lg:grid-cols-2 gap-x-8 pl-6">
                        {southOrders.map((order: Order) => (
                            <MagazineOrderCard order={order} key={order.id} />
                        ))}
                    </section>
                ) : <Alert message="Nenhum pedido encontrado para exibir." type="info" showIcon className="ml-6" />
            ),
            className: 'mb-4',
        },
    ].filter(Boolean) as CollapseProps['items']

    return (
        <>
            {
                filteredOrders?.length ? (
                    <Collapse
                        items={collapseItems}
                        ghost
                    />
                ) : (
                    <Alert message="Nenhum pedido encontrado para exibir." type="info" showIcon className="mt-8" />
                )
            }
        </>
    )
}