import { api } from "./api";

export const CustomerService = {
    async createCustomer(data: {
        name: string;
        phone: string;
        key_pix: string;
        bond: string;
        trust_level: 'baixo' | 'médio' | 'alto' | 'não sei';
    }){
        const response = await api.post("/customers", data);
        return response.data;
    },

    async getCustomers(){
        const response = await api.get("/customers");
        return response.data;
    },

    async getCustomerById(id: string){
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    async updateCustomer(id: string, data: {
        name: string;
        phone: string;
        key_pix: string;
        bond: string;
        trust_level: 'baixo' | 'médio' | 'alto' | 'não sei';
    }){
        const response = await api.patch(`/customers/${id}`, data);
        return response.data;
    },

    async deleteCustomer(id: string){
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    }
}