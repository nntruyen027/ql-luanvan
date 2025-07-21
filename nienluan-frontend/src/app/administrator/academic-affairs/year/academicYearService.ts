import api from "@/lib/axios"; // tuỳ cấu trúc dự án
import { AcademicYear } from "@/types/academicYear";
import { mapAcademicYear } from "./mapAcademicYear";


export const getAcademicYears = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/academic-years", { params });

    return {
        content: res.data.items.map(mapAcademicYear),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function getYearList() {
    const response = await api.get("/api/get-year-list");
    return response;
}

export async function addAcademicYear(data: Partial<AcademicYear>) {
    const response = await api.post("/api/add-academic-years", data);
    return response;
}

export async function updateAcademicYear(id: number, data: Partial<AcademicYear>) {
    const response = await api.put(`/api/update-academic-years/${id}`, data);
    return response;
}

export async function deleteAcademicYear(id: number) {
    const response = await api.delete(`/api/delete-academic-years/${id}`);
    return response;
}

export async function deleteMultiAcademicYear(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-academic-years`, multiID);
    return response;
}

export const searchAcademicYear = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-academic-years", { params });

    return {
        content: res.data.items.map(mapAcademicYear),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
