import { api } from "./api";

export const CustomerService = {
    async createCustomer(data: {
        name: string;
        phone: string;
    }){
        const response = await api.post("/customers", data);
        return response.data;
    },

    async getCustomers(signal?: AbortSignal){
        const response = await api.get("/customers", { signal });
        return response.data;
    },

    async getCustomerById(id: string, signal?: AbortSignal){
        const response = await api.get(`/customers/${id}`, { signal });
        return response.data;
    },

    async updateCustomer(id: string, data: {
        name: string;
        phone: string;
    }){
        const response = await api.patch(`/customers/${id}`, data);
        return response.data;
    },

    async deleteCustomer(id: string){
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    }
}