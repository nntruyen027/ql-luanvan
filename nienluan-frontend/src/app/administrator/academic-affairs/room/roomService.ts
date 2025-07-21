import api from "@/lib/axios";
import { mapRoom } from "./mapRoom";
import { Room } from "@/types/room";

export const getRoomList = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/room", { params });

    return {
        content: res.data.items.map(mapRoom),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};

export async function addRoom(data: Partial<Room>) {
    const response = await api.post("/api/add-room", data);
    return response;
}

export async function updateRoom(id: number, data: Partial<Room>) {
    const response = await api.put(`/api/update-room/${id}`, data);
    return response;
}

export async function deleteRoom(id: number) {
    const response = await api.delete(`/api/delete-room/${id}`);
    return response;
}

export async function deleteMultiRoom(multiID: number[]) {
    const response = await api.post(`/api/delete-multi-room`, multiID);
    return response;
}

export const searchRoom = async (params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}) => {
    const res = await api.get("/api/search-room", { params });

    return {
        content: res.data.items.map(mapRoom),
        totalElements: res.data.total,
        page: res.data.page,
        size: res.data.per_page,
    };
};