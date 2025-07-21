import api from "@/lib/axios";
import { mapThesisApproval } from "./mapThesisApproval";

export const getThesisApproval = async (params: {
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
    const res = await api.get("/api/thesis-register", { params });

    return {
        content: res.data.items.map(mapThesisApproval),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export const filterThesisApproval = async (params: {
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
        content: res.data.items.map(mapThesisApproval),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export const RejectThesis = async (id: number, data: any) => {
    const response = await api.post(`/api/reject-thesis/${id}`, data);
    return response;
}

export const ApproveThesis = async (id: number) => {
    const response = await api.get(`/api/approve-thesis/${id}`);
    return response;
}

export async function rejectMultiThesis(multiID: number[]) {
    const response = await api.post(`/api/reject-multi-thesis`, multiID);
    return response;
}

export async function approveMultiThesis(multiID: number[]) {
    const response = await api.post(`/api/approve-multi-thesis`, multiID);
    return response;
}



