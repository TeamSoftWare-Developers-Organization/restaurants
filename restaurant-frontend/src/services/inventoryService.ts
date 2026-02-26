import api from '@/lib/api';

export interface Ingredient {
    id: number;
    name: string;
    current_stock: number;
    unit: string;
    cost_per_unit: number;
    reorder_level: number;
    last_updated: string;
}

export const inventoryService = {
    getIngredients: async (): Promise<Ingredient[]> => {
        const response = await api.get('/inventory/ingredients/');
        return response.data;
    },
    createIngredient: async (data: Partial<Ingredient>): Promise<Ingredient> => {
        const response = await api.post('/inventory/ingredients/', data);
        return response.data;
    },
    updateIngredient: async (id: number, data: Partial<Ingredient>): Promise<Ingredient> => {
        const response = await api.put(`/inventory/ingredients/${id}/`, data);
        return response.data;
    },
    deleteIngredient: async (id: number): Promise<void> => {
        await api.delete(`/inventory/ingredients/${id}/`);
    }
};
