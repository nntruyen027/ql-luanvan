import api from "@/lib/axios";
import { mapPermissonGroup } from "./mapPermissionGroup";
import { PermissionGroup } from "@/types/permission";

export const getListPermissionGroup = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/permission-group", { params });

    return {
        content: res.data.items.map(mapPermissonGroup),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function roleByModule() {
    const response = await api.get('/api/all-role');
    return response;
}

export async function addRole(data: Partial<PermissionGroup>) {
    const response = api.post('/api/add-role', data);
    return response;
}

export async function updateRole(id: number, data: Partial<PermissionGroup>) {
    const response = api.put(`/api/update-role/${id}`, data);
    return response;
}

export async function deleteRole(id: number) {
    const response = api.delete(`/api/delete-role/${id}`);
    return response;
}

export async function deleteMultiPermissionGroup(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-permission-group`, multiID);
    return response;
}

export const filterPermissionGroup = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-permission-group", { params });

    return {
        content: res.data.items.map(mapPermissonGroup),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
