import { api } from "./api";

export const DashboardService = {
    async getInfo(){
        const response = await api.get("/dashboard");
        return response.data;
    },
}