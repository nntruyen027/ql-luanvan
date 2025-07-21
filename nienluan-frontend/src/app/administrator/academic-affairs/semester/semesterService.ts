import api from "@/lib/axios";
import { mapSemester } from "./mapSemester";
import { Semester } from "@/types/semester";


export const getSemester = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/semester", { params });

    return {
        content: res.data.items.map(mapSemester),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function addSemester(data: Partial<Semester>) {
    const response = await api.post("/api/add-semester", data);
    return response;
}

export async function updateSemester(id: number, data: Partial<Semester>) {
    const response = await api.put(`/api/update-semester/${id}`, data);
    return response;
}

export async function deleteSemester(id: number) {
    const response = await api.delete(`/api/delete-semester/${id}`);
    return response;
}

export async function deleteMultiSemester(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-semester`, multiID);
    return response;
}

export const filterSemester = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-semester", { params });

    return {
        content: res.data.items.map(mapSemester),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
