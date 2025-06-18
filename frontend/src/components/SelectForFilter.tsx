import { useMemo } from "react";
import { Select, Typography } from "antd";
import { currentYear } from "../utils/getYearAndQuarter";

const { Text } = Typography;

interface SelectProps {
    selectedYear: number
    selectedQuarter: string
    setSelectedQuarter: (value: string) => void
    setSelectedYear: (value: number) => void
}

export default function SelectForFilter({selectedYear, setSelectedYear, selectedQuarter, setSelectedQuarter}: SelectProps) {

    const yearOptions = useMemo(() => {
        const years = [];
        for (let i = 2025; i <= currentYear + 1; i++) {
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

    return (
        <section className="flex flex-col md:flex-row gap-4 mt-8 items-center justify-center mx-5">
            <div className="w-full">
                <Text strong>Ano:</Text>
                <Select
                    value={selectedYear}
                    onChange={(value: number) => setSelectedYear(value)}
                    options={yearOptions}
                    className="w-full"
                />
            </div>
            <div className="w-full">
                <Text strong>Trimestre:</Text>
                <Select
                    value={selectedQuarter}
                    onChange={(value: string) => setSelectedQuarter(value)}
                    options={quarterOptions}
                    className="w-full"
                />
            </div>
        </section>
    )
}