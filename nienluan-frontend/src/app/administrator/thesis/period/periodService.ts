import api from "@/lib/axios";
import { mapPeriod } from "./mapPeriod";
import { ThesisReportPeriod } from "@/types/thesisReportPeriod";

export const getPeriodList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/period-report", { params });

    return {
        content: res.data.items.map(mapPeriod),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function addReportPeriod(data: Partial<ThesisReportPeriod>) {
    const response = api.post("/api/add-report-period", data);
    return response;
}

export async function updateReportPeriod(id: number, data: Partial<ThesisReportPeriod>) {
    const response = api.put(`/api/update-report-period/${id}`, data);
    return response;
}


export async function getSemesterOptions() {
    const response = api.get("/api/get-semester-option");
    return response;
}

export async function getSemesterByYear(id: number) {
    const response = api.get(`/api/get-semester-by-year/${id}`);
    return response;
}

export async function deleteReportPeriod(id: number) {
    const response = api.delete(`/api/delete-report-period/${id}`);
    return response;
}

export async function deleteMultiReportPeriod(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-report-period`, multiID);
    return response;
}

export const filterReportPeriod = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-report-period", { params });

    return {
        content: res.data.items.map(mapPeriod),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

