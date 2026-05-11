import { api } from "./api";

export const DashboardService = {
    async getInfo() {
        const response = await api.get("/dashboard");
        return response.data;
    },

    async getTimeline({ limit }: { limit?: number }) {
        const response = await api.get(`/timeline?limit=${limit || 5}`);
        return response.data;
    },

    async getNextPayments({ limit }: { limit?: number }) {
        const response = await api.get(`/next-payments?limit=${limit}`);
        return response.data;
    }
}