import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Result } from 'antd';

export default function SuccessPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const orderSuccess = localStorage.getItem(`${import.meta.env.VITE_ORDERITEM}`)

        if (!orderSuccess) {
            navigate('/', { replace: true })
            return
        }

    }, [navigate])

    return (
        <Result
            status="success"
            title="Pedido Realizado com Sucesso!"
            subTitle="Seu pedido foi enviado e será processado. Agradecemos a sua contribuição!"
        >
        </Result>
    )
}