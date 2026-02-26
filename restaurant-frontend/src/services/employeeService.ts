import api from '@/lib/api';

export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    phone_number?: string;
    hire_date: string;
    username: string;
}

export const employeeService = {
    getEmployees: async (): Promise<Employee[]> => {
        const response = await api.get('/employees/');
        return response.data;
    },
    createEmployee: async (data: any): Promise<Employee> => {
        const response = await api.post('/employees/', data);
        return response.data;
    },
    updateEmployee: async (id: number, data: any): Promise<Employee> => {
        const response = await api.put(`/employees/${id}/`, data);
        return response.data;
    },
    deleteEmployee: async (id: number): Promise<void> => {
        await api.delete(`/employees/${id}/`);
    }
};
