export interface OrderItem {
  id: number;
  magazine: string;
  quantity: number;
}

export interface Order {
  id: number;
  region: string;
  congregation: string;
  data: string;
  leader: string;
  department_head: string;
  phone: string;
  itens_pedido: OrderItem[];
}