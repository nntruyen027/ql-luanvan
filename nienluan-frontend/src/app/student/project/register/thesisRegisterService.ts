import api from "@/lib/axios";
import { mapThesisRegister } from "./mapThesisRegister";

export const getThesisRegisterList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    lecturer?: number | null,
    status?: string | null,
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/thesis-register-for-student", { params });

    return {
        content: res.data.items.map(mapThesisRegister),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function getLecturerOptions() {
    const response = api.get("/api/get-lecturer-option");
    return response;
}

export async function withdrawThesis(id: number) {
    const response = await api.get(`/api/withdraw-thesis/${id}`);
    return response;
}

export const filterThesisRegister = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    lecturer?: number | null,
    status?: string | null,
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-thesis-register", { params });

    return {
        content: res.data.items.map(mapThesisRegister),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
