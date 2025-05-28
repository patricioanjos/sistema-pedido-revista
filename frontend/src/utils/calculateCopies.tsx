import type { Order } from "../types";

export const calculateTotalCopies = (orders: Order[]): number => {
    return orders.reduce((acc, order) => {
        const orderItems = order.itens_pedido || []
        const orderCopies = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
        return acc + orderCopies;
    }, 0)
}