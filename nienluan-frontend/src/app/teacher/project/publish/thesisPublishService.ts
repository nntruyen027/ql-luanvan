import api from "@/lib/axios";
import { mapThesisPublish } from "./mapThesisPublish";

export const getThesisPublishList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/thesis-publish", { params });

    return {
        content: res.data.items.map(mapThesisPublish),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function getReportPeriodOptions() {
    const response = api.get("/api/get-report-period-option");
    return response;
}

export async function addThesis(data: any) {
    const response = api.post('/api/add-thesis-publish', data);
    return response;
}

export async function registerThesis(id: number, data: any) {
    const response = api.post(`/api/register-thesis-publish/${id}`, data);
    return response;
}

export async function updateThesis(id: number, data: any) {
    const response = await api.post(`/api/update-thesis-publish/${id}`, data);
    return response;
}


export async function getReportPeriodBySemester(semesterId: number) {
    const response = api.get(`/api/get-report-period-by-semester/${semesterId}`);
    return response;
}

export async function getStudent() {
    const response = api.get(`/api/get-student`);
    return response;
}

export async function deleteThesisPublish(id: number) {
    const response = api.delete(`/api/delete-thesis-publish/${id}`);
    return response;
}

export async function deleteMultiThesisPublish(multiID: number[]) {
    const response = api.post(`/api/delete-multi-thesis-publish`, multiID);
    return response;
}

export const filterThesisPublish = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-thesis-publish", { params });

    return {
        content: res.data.items.map(mapThesisPublish),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
