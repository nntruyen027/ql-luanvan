import api from "@/lib/axios";
import { mapCommittee } from "./mapCommittee";

export async function addCommittee(data: any) {
    const response = api.post("/api/add-committee", data);
    return response;
}

export async function updateCommittee(id: number, data: any) {
    const response = api.post(`/api/update-committee/${id}`, data);
    return response;
}

export async function getTeacherOptions() {
    const response = api.get("/api/get-teacher-options");
    return response;
}


export const getCommitteeList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/get-committee-list", { params });

    return {
        content: res.data.items.map(mapCommittee),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};


export const filterCommittee = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/filter-committee", { params });

    return {
        content: res.data.items.map(mapCommittee),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};



export async function deleteCommittee(id: number) {
    const response = api.get(`/api/delete-committee/${id}`);
    return response;
}


export async function deleteMultiCommittee(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-committee`, multiID);
    return response;
}