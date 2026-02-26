import api from '@/lib/api';
import { MenuItem } from './menuService';

export interface OrderItem {
    id: number;
    menu_item: MenuItem;
    quantity: number;
    unit_price: number;
    notes?: string;
}

export interface Order {
    id: number;
    employee?: any;
    table_number?: string;
    order_date_time: string;
    status: string;
    total_amount: number;
    discount_amount: number;
    items: OrderItem[];
}

export const orderService = {
    getOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders/');
        return response.data;
    },
    createOrder: async (data: any): Promise<Order> => {
        const response = await api.post('/orders/', data);
        return response.data;
    },
    updateOrder: async (id: number, data: any): Promise<Order> => {
        const response = await api.put(`/orders/${id}`, data);
        return response.data;
    },
    deleteOrder: async (id: number): Promise<void> => {
        await api.delete(`/orders/${id}`);
    }
};
