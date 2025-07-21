import api from "@/lib/axios";
import { mapThesisPublish } from "./mapThesisPublish";

export const getThesisPublishList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    lecturer?: number | null;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/thesis-publish-for-student", { params });

    return {
        content: res.data.items.map(mapThesisPublish),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};



export async function getReportPeriodBySemester(semesterId: number) {
    const response = api.get(`/api/get-report-period-by-semester/${semesterId}`);
    return response;
}


export const filterThesisPublish = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    lecturer?: number | null;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-thesis-publish-for-student", { params });

    return {
        content: res.data.items.map(mapThesisPublish),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
