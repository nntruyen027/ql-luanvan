import { Room } from "@/types/room";

interface ApiRoom {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
}

export function mapRoom(data: ApiRoom): Room {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.is_active ? "Active" : "Inactive",
    }
}