import { Suspense, useEffect, useState } from "react";
import MagazineOrderCard from "../components/MagazineOrderCard";
import axios from "axios";
import type { Order } from "../types";
import { Alert, Spin } from "antd";

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

    // Filtros dinâmicos. Use map ou reduce para criar um objeto de regiões,
    // ou continue com filtros individuais se as regiões forem fixas e poucas.
    // Garanta que a comparação de região seja case-insensitive.
    const eastOrders = allOrders.filter((order) => order.region?.toLowerCase() === 'leste');
    const northOrders = allOrders.filter((order) => order.region?.toLowerCase() === 'norte');
    const southOrders = allOrders.filter((order) => order.region?.toLowerCase() === 'sul');
    // Você pode adicionar mais regiões aqui conforme necessário

    // Calcular totais para o cabeçalho (Opcional, mas útil para o design original)
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

    return (
        <main className="max-w-[105rem] mx-auto p-4">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-4">Pedidos de Revistas</h1>

            <section id="east">
                <div className="p-4 mb-4 rounded-lg border-2 bg-blue-50 border-blue-200 flex justify-between">
                    Leste
                    
                    <p>{eastOrders.length} Congregações</p>
                </div>

                <section className="flex gap-8">
                    {eastOrders.map((order) => <MagazineOrderCard key={order.id} order={order} />)}
                </section>
            </section>

            <section id="north">
                <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200 mb-4">
                    Norte
                </div>

                {northOrders.map((order) => <MagazineOrderCard key={order.id} order={order} />)}
            </section>

            <section id="south">
                <div className="p-4 rounded-lg border-2 bg-orange-50 border-orange-200 mb-4">
                    Sul
                </div>

                {southOrders.map((order) => <MagazineOrderCard key={order.id} order={order} />)}
            </section>
        </main>
    )
}