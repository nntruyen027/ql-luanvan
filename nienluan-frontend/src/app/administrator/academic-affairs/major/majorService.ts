import api from "@/lib/axios";
import { mapMajor } from "./mapMajor";
import { Major } from "@/types/major";

export const getMajorList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/major", { params });

    return {
        content: res.data.items.map(mapMajor),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};


export async function addMajor(data: Partial<Major>) {
    const response = await api.post("/api/add-major", data);
    return response;
}

export async function updateMajor(id: number, data: Partial<Major>) {
    const response = await api.put(`/api/update-major/${id}`, data);
    return response;
}

export async function deleteMajor(id: number) {
    const response = api.delete(`/api/delete-major/${id}`)
    return response;
}

export async function deleteMultiMajor(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-major`, multiID);
    return response;
}

export const searchMajor = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-major", { params });

    return {
        content: res.data.items.map(mapMajor),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};