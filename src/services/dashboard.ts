import { api } from "./api";

export const DashboardService = {
    async getInfo(signal?: AbortSignal) {
        const response = await api.get("/dashboard", { signal });
        return response.data;
    },

    async getTimeline({ limit }: { limit?: number }, signal?: AbortSignal) {
        const params = limit !== undefined ? `?limit=${limit}` : "";
        const response = await api.get(`/timeline${params}`, { signal });
        return response.data;
    },

    async getNextPayments({ limit }: { limit?: number }, signal?: AbortSignal) {
        const params = limit !== undefined ? `?limit=${limit}` : "";
        const response = await api.get(`/next-payments${params}`, { signal });
        return response.data;
    }
}