import api from "@/lib/axios";
import { mapTeacher } from "./mapTeacher";
import { Teacher } from "@/types/user";

export const getTeacherList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    major?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/teacher-list", { params });

    return {
        content: res.data.items.map(mapTeacher),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function addTeacher(data: Partial<Teacher>) {
    const response = api.post('/api/add-teacher', data);
    return response;
}

export async function updateTeacher(id: number, data: Partial<Teacher>) {
    const response = api.put(`/api/update-teacher/${id}`, data);
    return response;
}

export async function getMajorListOptions() {
    const response = api.get('/api/get-major-list-option');
    return response;
}

export async function getRolesListOption() {
    const response = api.get('/api/get-roles-list-option');
    return response;
}

export async function deleteTeacher(id: number) {
    const response = api.delete(`/api/delete-teacher/${id}`);
    return response;
}

export async function deleteMultiTeacher(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-teacher`, multiID);
    return response;
}

export const filterTeacher = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    major?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-teacher", { params });

    return {
        content: res.data.items.map(mapTeacher),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function createTeacherAccount(id: number, data: FormData) {
    const response = api.post(`/api/create-teacher-account/${id}`, data);
    return response;
};

export async function resetTeacherAccount(id: number) {
    const response = api.get(`/api/reset-teacher-account/${id}`);
    return response;
};


export async function updateUserInformation(id: number, data: any) {
    const response = api.post(`/api/update-user-information/${id}`, data);
    return response;
}

export async function changeUserPassword(id: number, data: any) {
    const response = api.post(`/api/change-user-password/${id}`, data);
    return response;
}