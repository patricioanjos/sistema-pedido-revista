import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

type FieldType = {
    email?: string;
    password?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Erro:', errorInfo);
    message.error('Falha ao fazer login')
}

export default function LoginForm() {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const onHandleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        axios.post(`${import.meta.env.VITE_BASE_URL}/login`, values)
            .then(async function (response) {
                const { session, user } = response.data

                if (session && user) {
                    await login(session, user)
                    message.success('Login realizado com sucesso!')
                    navigate("/dashboard", { replace: true })
                } else {
                    message.error('Resposta de login inválida do servidor.')
                }
            })
            .catch(function (error) {
                console.error("Erro de login:", error);

                if (error.response && error.response.status === 401) {
                    message.error('Email ou senha inválidos.')
                } else {
                    message.error('Falha ao fazer login. Tente novamente mais tarde.')
                }
            })
    }

    return (
        <Form
            layout="vertical"
            onFinish={onHandleFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Por favor, insisra seu email!' }]}
            >
                <Input placeholder="seuemail@example.com" />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
                <Input.Password placeholder="********" />
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700
                hover:to-indigo-700 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 
                transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]">
                    Entrar
                </Button>
            </Form.Item>
        </Form>
    )
}