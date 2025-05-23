import { Button, Form, Input, InputNumber, Select, message } from 'antd';
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
            initialValues={{ magazines: [{}] }}
            // className='space-y-6'
        >
            <Form.Item
                label="Região"
                name="region"
                rules={[{ required: true, message: 'Por favor, selecione a região' }]}
            >
                <Select
                    showSearch
                    placeholder="Selecione a região"
                    className="w-full"
                    options={[
                        { value: 'Leste', label: 'Leste' },
                        { value: 'Norte', label: 'Norte' },
                        { value: 'Sul', label: 'Sul' },
                    ]}
                />
            </Form.Item>

            <Form.Item
                label="Congregação"
                name="congregation"
                hasFeedback
                rules={[{ required: true, message: 'Por favor, insira a congregação' }]}
            >
                <Input placeholder="Palmeira de Elim" />
            </Form.Item>

            <Form.Item
                label="Dirigente"
                name="leader"
                rules={[{ required: true, message: 'Por favor, insira o nome do dirigente' }]}
            >
                <Input placeholder="Nome dirigente" />
            </Form.Item>

            <Form.Item
                label="Líder do departamento"
                name="departmentHead"
                rules={[{ required: true, message: 'Por favor, insira o nome do líder' }]}
            >
                <Input placeholder="Nome líder" />
            </Form.Item>

            <Form.Item
                label="Telefones"
                name="phone"
                rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
                className="font-medium"
            >
                <Input placeholder="(xx) xxxxx-xxxx" />
            </Form.Item>

            <Form.List name="magazines">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div
                                key={key}
                                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 border rounded-lg shadow-sm bg-gray-50 mb-2"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    rules={[{ required: true, message: '' }]}
                                    label="Revista"
                                    className="flex-1"
                                >
                                    <Select
                                        placeholder="Selecione a revista"
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
                                    className="font-medium"
                                >
                                    <InputNumber min={1} placeholder="1" className="w-full" />
                                </Form.Item>

                                <Button
                                    onClick={() => remove(name)}
                                    type="default"
                                    className="self-start md:self-center text-red-500 border-red-300"
                                >
                                    Remover
                                </Button>
                            </div>
                        ))}

                        {fields.length < 6 && (
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    block
                                    onClick={() => add()}
                                    className="w-full border-green-600"
                                >
                                    Adicionar Revista
                                </Button>
                            </Form.Item>
                        )}
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    Fazer Pedido
                </Button>
            </Form.Item>
        </Form>
    );
}