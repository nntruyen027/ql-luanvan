import api from "@/lib/axios";
import { mapStudent } from "./mapStudent";
import { Student } from "@/types/user";

export const getStudentList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    major?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/student-list", { params });

    return {
        content: res.data.items.map(mapStudent),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function addStudent(data: Partial<Student>) {
    const response = api.post('/api/add-student', data);
    return response;
}

export async function updateStudent(id: number, data: Partial<Student>) {
    const response = api.put(`/api/update-student/${id}`, data);
    return response;
}

export async function deleteStudent(id: number) {
    const response = api.delete(`/api/delete-student/${id}`);
    return response;
}

export async function deleteMultiStudent(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-student`, multiID);
    return response;
}


export const filterStudent = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    major?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-student", { params });

    return {
        content: res.data.items.map(mapStudent),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};


export async function createStudentAccount(id: number, data: FormData) {
    const response = api.post(`/api/create-student-account/${id}`, data);
    return response;
};

export async function resetStudentAccount(id: number) {
    const response = api.get(`/api/reset-student-account/${id}`);
    return response;
};
