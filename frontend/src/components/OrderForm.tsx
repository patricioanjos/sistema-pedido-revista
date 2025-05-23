import { Button, Form, Input, InputNumber, Select, Space, message } from 'antd';
import axios from 'axios'

interface OrderData {
    region: string
    congregation: string
    leader: string
    departmendHead: string
    phone: string
    magazines: Array<{}>
}

export default function OrderForm() {
    const [form] = Form.useForm()

    const onHandleFinish = (values: OrderData) => {
        axios.post(`${import.meta.env.VITE_BASE_URL}/orders`, values)
            .then(function (response) {
                console.log(response.data);
                message.success('Pedido realizado com sucesso!');
                form.resetFields();
            })
            .catch(function (error) {
                console.error(error);
                message.error('Falha ao enviar pedido.');
            });
    };

    return (
        <Form
            form={form}
            onFinish={onHandleFinish}
            layout="vertical"
            initialValues={{
                magazines: [{}], // já inicia com um input
            }}
        >
            <Form.Item label="Região" name="region" rules={[{ required: true, message: 'Por favor, selecione a região' }]}>
                <Select
                    showSearch
                    placeholder="Leste"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        { value: 'Leste', label: 'Leste' },
                        { value: 'Norte', label: 'Norte' },
                        { value: 'Sul', label: 'Sul' },
                    ]}
                />
            </Form.Item>

            <Form.Item label="Congregação" name="congregation" hasFeedback
                rules={[{ required: true, message: 'Por favor, insira a congregação' }]}>
                <Input placeholder="Palmeira de Elim" />
            </Form.Item>
            <Form.Item label="Dirigente" name="leader" rules={[{ required: true, message: 'Por favor, insira o nome do dirigente' }]}>
                <Input placeholder="Nome dirigente" />
            </Form.Item>
            <Form.Item label="Líder do departamento" name="departmentHead" rules={[{ required: true, message: 'Por favor, insira o nome do líder' }]}>
                <Input placeholder="Nome líder" />
            </Form.Item>
            <Form.Item label="Telefones" name="phone" rules={[{ required: true, message: 'Por favor, insira o telefone' }]}>
                <Input placeholder="input placeholder" />
            </Form.Item>

            <Form.List name="magazines">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="center">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    rules={[{ required: true, message: '' }]}
                                    label="Revista"
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Professor Maternal"
                                        options={[
                                            { value: 'maternal', label: 'Maternal' },
                                            { value: 'primários', label: 'Primários' },
                                            { value: 'juniores', label: 'Juniores' },
                                            { value: 'professor_maternal', label: 'Professor Maternal' },
                                            { value: 'professor_primarios', label: 'Professor Primários' },
                                            { value: 'professor_juniores', label: 'Professor Juniores' },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'quantity']}
                                    rules={[{ required: true, message: '' }]}
                                    label="Quantidade"
                                >
                                    <InputNumber min={1} placeholder='1' />
                                </Form.Item>
                                <Button onClick={() => remove(name)} type='default'>remover</Button>
                            </Space>
                        ))}
                        <Form.Item>
                            {fields.length < 6 &&
                                <Button type="dashed"
                                    block
                                    onClick={() => add()}
                                >
                                    Adicionar Revista
                                </Button>
                            }
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    );
}