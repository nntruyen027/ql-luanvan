import api from "@/lib/axios";
import { ThesisTask } from "@/types/thesisTask";
import { mapTask } from "./mapTask";

export async function thesisByTime(year: number, semester: number, reportPeriod: number) {
    const response = await api.get('/api/get-thesis-by-time-for-student', {
        params: {
            year: year,
            semester: semester,
            reportPeriod: reportPeriod
        }
    });
    return response.data;
}


export async function thesisActiveByTime(year: number, semester: number, reportPeriod: number) {
    const response = await api.get('/api/get-thesis-active-by-time', {
        params: {
            year: year,
            semester: semester,
            reportPeriod: reportPeriod
        }
    });
    return response.data;
}



export async function addThesisTask(data: Partial<ThesisTask>) {
    const response = await api.post('/api/add-thesis-task', data);
    return response;
}

export async function studentUpdateThesisTask(id: number, data: Partial<ThesisTask>) {
    const response = await api.post(`/api/student-update-thesis-task/${id}`, data);
    return response;
}


export async function reviewThesisTask(id: number, data: any) {
    const response = await api.post(`/api/review-thesis-task/${id}`, data);
    return response;
}

export async function deleteThesisTask(id: number) {
    const response = await api.delete(`/api/delete-thesis-task/${id}`);
    return response;
}


export async function deleteMultiThesisTask(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-thesis-task`, multiID);
    return response;
}

export const getThesisTask = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    thesis?: number | null,
    status?: string | null,
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/get-thesis-task-for-student", { params });

    return {
        content: res.data.items.map(mapTask),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};


export const filterThesisTask = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    year?: number | null;
    semester?: number | null;
    reportPeriod?: number | null;
    thesis?: number | null,
    status?: string | null,
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-thesis-task-for-student", { params });

    return {
        content: res.data.items.map(mapTask),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};
