import api from "@/lib/axios";
import { mapPermisson } from "./mapPermission";

export const getListPermission = async (params: {
    page?: number;
    per_page?: number;
    module?: string;
    action?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/permission", { params });

    return {
        content: res.data.items.map(mapPermisson),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function addPermission(data: Partial<Permissions>) {
    const response = await api.post("/api/add-permission", data);
    return response;
}

export async function updatePermission(id: number, data: Partial<Permissions>) {
    const response = await api.put(`/api/update-permission/${id}`, data);
    return response;
}

export async function deletePermission(id: number) {
    const response = api.delete(`/api/delete-permission/${id}`)
    return response;
}


export const filterPermission = async (params: {
    page?: number;
    per_page?: number;
    module?: string;
    action?: string;
    search?: string;
    year?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-permission", { params });

    return {
        content: res.data.items.map(mapPermisson),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function deleteMultiPermission(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-permission`, multiID);
    return response;
}

