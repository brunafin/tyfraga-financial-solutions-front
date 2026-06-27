import { api } from "./api";

export const LoanService = {
    async createLoan(data: {
        customer_id: string;
        original_value: number;
        loan_value: number;
        loan_date: string;
        tax: number;
        installment_value: number;
        installments: {
            ref: number;
            due_date: string;
            installment_value?: number;
        }[];
    }) {
        const response = await api.post("/loans", data);
        return response.data;
    },

    // async getLoans(){
    //     const response = await api.get("/loans");
    //     return response.data;
    // },

    async getLoanById(id: string, signal?: AbortSignal){
        const response = await api.get(`/loans/${id}`, { signal });
        return response.data;
    },

    // async updateLoan(id: string, data: {
    //     name: string;
    //     phone: string;
    // }){
    //     const response = await api.patch(`/loans/${id}`, data);
    //     return response.data;
    // },

    async deleteLoan(id: string){
        const response = await api.delete(`/loans/${id}`);
        return response.data;
    },

    async checkPayDate(installmentId: number){
        await api.patch(`/payments/${installmentId}/pay`);
    }
}