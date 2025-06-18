import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Order } from "../types";
import { Button, Layout, Typography, } from "antd";
import { calculateTotalCopies } from "../utils/calculateCopies";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { useOrderingStatus } from "../context/OrderingStatusContext";
import { currentQuarter, currentYear } from "../utils/getYearAndQuarter";
import SelectForFilter from "../components/SelectForFilter";
import OrdersCollapse from "../components/OrdersCollapse";
import dayjs from "dayjs";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear); // dayjs com o plugin de trimestre

const { Title } = Typography;
const { Content } = Layout;

export default function Dashboard() {
    const { session } = useContext(AuthContext)
    const [allOrders, setAllOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // Se o usuário quer ver os pedidos do "2º Trimestre", ele está olhando para pedidos feitos no Q1.
    // Assim, o trimestre padrão a ser exibido no select para o usuário é o trimestre atual de revistas.
    const [selectedQuarter, setSelectedQuarter] = useState<string>(`T${currentQuarter + 1}`);

    const { isOrderingEnabled, toogleOrderingStatus } = useOrderingStatus()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setError(null); // Limpa erros anteriores

                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`, {
                    headers: { 'Authorization': `Bearer ${session?.access_token}` }
                });

                // Verifica se a resposta tem dados antes de definir
                if (response.data) {
                    setAllOrders(response.data);
                } else {
                    throw new Error("Dados da API vazios ou inválidos.");
                }
            } catch (err: any) {
                console.error("Erro ao buscar pedidos:", err);
                setError(err.response.data.message || "Ocorreu um erro ao buscar os pedidos.");
            } finally {
                setLoading(false)
            }
        };

        fetchOrders();
    }, []); // Array de dependências vazio: executa apenas uma vez no montante do componente

    const filteredOrders = useMemo(() => {
        return allOrders.filter((order: Order) => {
            const orderDate = dayjs(order.data)
            const orderYear = orderDate.year()
            const orderQuarter = orderDate.quarter()

            // Mapeia o trimestre selecionado pelo usuário (Ex: 'T2') para o trimestre de pedido correspondente
            // Se o usuário quer o "2º Trimestre", ele busca pedidos feitos no 1º Trimestre.
            let requiredOrderQuarter: number;
            switch (selectedQuarter) {
                case 'T1':
                    requiredOrderQuarter = 4 // Pedidos para T1 são feitos no T4 do ano anterior
                    break
                case 'T2':
                    requiredOrderQuarter = 1
                    break
                case 'T3':
                    requiredOrderQuarter = 2
                    break
                case 'T4':
                    requiredOrderQuarter = 3
                    break
                default:
                    return false
            }

            let yearMatches = false
            // Se o trimestre de pedido é o Q4, o ano de pedido é o ano anterior ao ano selecionado pelo usuário.
            // Ex: Usuário seleciona 2025 (para T1 de 2025, pedido feito em T4 de 2024)
            if (requiredOrderQuarter === 4) {
                yearMatches = orderYear === selectedYear - 1
            } else {
                yearMatches = orderYear === selectedYear
            }

            // Verifica se o trimestre do pedido corresponde ao trimestre a ser filtrado
            const quarterMatches = orderQuarter === requiredOrderQuarter

            return yearMatches && quarterMatches
        });
    }, [allOrders, selectedYear, selectedQuarter])

    const totalMagazinesCopies = calculateTotalCopies(filteredOrders)
    const totalOrdersCount = filteredOrders.length;

    return (
        <main className="min-h-screen">
            <Header />

            <Title level={2} className="leading-[64px] text-center">
                Pedidos de Revistas
            </Title>


            <Content>
                {/* Filtros de Ano e Trimestre */}
                <SelectForFilter 
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedQuarter={selectedQuarter}
                    setSelectedQuarter={setSelectedQuarter}
                />

                <div className="ml-5 mt-2 mb-6">
                    <Button onClick={() => toogleOrderingStatus(!isOrderingEnabled)} color={isOrderingEnabled ? "red" : "default"} variant="solid">
                        {isOrderingEnabled ? "Desativar Pedidos" : "Ativar Pedidos"}
                    </Button>
                    <span className="text-sm mx-2">
                        Pedidos estão atualmente {isOrderingEnabled ? "ATIVOS" : "DESATIVADOS"}
                    </span>
                </div>

                <OrdersCollapse 
                    allOrders={allOrders}
                    filteredOrders={filteredOrders}
                    loading={loading}
                    error={error}
                />

                <section className="mt-12 mx-4 p-6 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Resumo do Trimestre</h3>

                    <section className="flex gap-4">
                        <div className="bg-white w-full h-28 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-2xl font-bold text-blue-600">{totalOrdersCount}</span>
                            <p>Total de pedidos</p>
                        </div>
                        <div className="bg-white w-full h-28 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-2xl font-bold text-green-600">{totalMagazinesCopies}</span>
                            <p>Total de revistas</p>
                        </div>
                    </section>
                </section>
            </Content>
        </main>
    );
}