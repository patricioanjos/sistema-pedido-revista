import { useEffect, useMemo, useState } from "react";
import MagazineOrderCard from "../components/MagazineOrderCard";
import axios from "axios";
import type { Order } from "../types";
import { Alert, Collapse, Layout, Select, Space, Spin, Typography, type CollapseProps } from "antd";
import { calculateTotalCopies } from "../utils/calculateCopies";
import { CodeSandboxOutlined, ReadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear); // dayjs com o plugin de trimestre

const { Title, Text } = Typography;
const { Content } = Layout;

const currentYear = dayjs().year();

// Se estamos no Q2, os pedidos foram feitos no Q1, para o Q2.
// Se queremos ver o '2º Trimestre' na UI, a data do pedido é do '1º Trimestre'.
const currentQuarter = dayjs().quarter(); // Q1, Q2, Q3, Q4

export default function Dashboard() {
    const [allOrders, setAllOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // Se o usuário quer ver os pedidos do "2º Trimestre", ele está olhando para pedidos feitos no Q1.
    // Assim, o trimestre padrão a ser exibido no select para o usuário é o trimestre atual de revistas.
    const [selectedQuarter, setSelectedQuarter] = useState<string>(`T${currentQuarter + 1}`);

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

    const yearOptions = useMemo(() => {
        const years = [];
        for (let i = currentYear - 2; i <= currentYear + 1; i++) {
            years.push({ value: i, label: String(i) });
        }
        return years;
    }, [currentYear]);

    // Opções de trimestres
    const quarterOptions = [
        { value: 'T1', label: '1º Trimestre' }, // Pedidos feitos no Q4 do ano anterior
        { value: 'T2', label: '2º Trimestre' },
        { value: 'T3', label: '3º Trimestre' },
        { value: 'T4', label: '4º Trimestre' },
    ];

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

    const eastOrders = filteredOrders.filter((order) => order.region?.toLowerCase() === 'leste');
    const northOrders = filteredOrders.filter((order) => order.region?.toLowerCase() === 'norte');
    const southOrders = filteredOrders.filter((order) => order.region?.toLowerCase() === 'sul');

    const totalEastMagazinesCopies = calculateTotalCopies(eastOrders)
    const totalNorthMagazinesCopies = calculateTotalCopies(northOrders)
    const totalSouthMagazinesCopies = calculateTotalCopies(southOrders)
    const totalMagazinesCopies = calculateTotalCopies(filteredOrders)

    // Calcular totais para o cabeçalho
    const totalOrdersCount = filteredOrders.length;


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
        <main className="min-h-screen">
            <Title level={2} className="m-0 leading-[64px] text-center">
                Pedidos de Revistas
            </Title>


            <Content>
                {/* Filtros de Ano e Trimestre */}
                <div className="flex flex-col sm:flex-row gap-4 my-8 items-center justify-center">
                    <Space size="middle">
                        <Text strong>Ano:</Text>
                        <Select
                            value={selectedYear}
                            onChange={(value: number) => setSelectedYear(value)}
                            options={yearOptions}
                            style={{ width: 120 }}
                        />
                        <Text strong>Trimestre:</Text>
                        <Select
                            value={selectedQuarter}
                            onChange={(value: string) => setSelectedQuarter(value)}
                            options={quarterOptions}
                            style={{ width: 150 }}
                        />
                    </Space>
                </div>

                {filteredOrders?.length ? (
                    <Collapse
                        items={collapseItems}
                        ghost
                    />
                ) : (
                    <Alert message="Nenhum pedido encontrado para exibir." type="info" showIcon className="mt-8" />
                )}

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