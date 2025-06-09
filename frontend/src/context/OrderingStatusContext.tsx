import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { message } from 'antd';

interface OrderingStatusContextType {
    isOrderingEnabled: boolean;
    loadingOrderingStatus: boolean;
    errorOrderingStatus: string | null;
    toogleOrderingStatus: (enabled: boolean) => Promise<void>;
    refetchOrderingStatus: () => void;
}

const OrderingStatusContext = createContext<OrderingStatusContextType | undefined>(undefined)

interface OrderingStatusProviderProps {
    children: ReactNode;
}

export const OrderingStatusProvider: React.FC<OrderingStatusProviderProps> = ({ children }) => {
    const [isOrderingEnabled, setIsOrderingEnabled] = useState<boolean>(true);
    const [loadingOrderingStatus, setLoadingOrderingStatus] = useState<boolean>(false);
    const [errorOrderingStatus, setErrorOrderingStatus] = useState<string | null>(null);
    const { session } = useContext(AuthContext)

    const fetchOrderingStatus = async () => {
        try {
            setLoadingOrderingStatus(true)
            setErrorOrderingStatus(null)
            const response = await axios.get<{ isEnabled: boolean }>(`${import.meta.env.VITE_BASE_URL}/settings`);
            setIsOrderingEnabled(response.data.isEnabled)
        } catch (error: any) {
            console.error("Erro ao buscar status de pedidos:", error)
            setErrorOrderingStatus(error.message || "Falha ao carregar status de pedidos.")
            setIsOrderingEnabled(false)
        } finally {
            setLoadingOrderingStatus(false);
        }
    }

    const toogleOrderingStatus = async (enabled: boolean) => {
        try {
            setLoadingOrderingStatus(true)
            setErrorOrderingStatus(null)
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/settings`,
                { enabled: enabled },
                {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                    },
                }
            )

            if (response.data) {
                setIsOrderingEnabled(response.data.data.is_ordering_enabled)
                message.success('Status do pedido atualizado com sucesso!')
            } else {
                throw new Error("Dados da API vazios ou inválidos.")
            }
        } catch (error: any) {
            let errorMessage = 'Falha ao atualizar status.';
            message.error(errorMessage);
        } finally {
            setLoadingOrderingStatus(false)
        }
    }

    useEffect(() => {
        fetchOrderingStatus();
    }, [session])

    const value = {
        isOrderingEnabled,
        loadingOrderingStatus,
        errorOrderingStatus,
        toogleOrderingStatus,
        refetchOrderingStatus: fetchOrderingStatus,
    }

    return (
        <OrderingStatusContext.Provider value={value}>
            {children}
        </OrderingStatusContext.Provider>
    )
}

export const useOrderingStatus = () => {
  const context = useContext(OrderingStatusContext);
  if (context === undefined) {
    throw new Error('useOrderingStatus must be used within an OrderingStatusProvider');
  }
  return context
}