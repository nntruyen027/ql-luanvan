import { Major } from "@/types/major";



interface ApiMajor {
    id: number;
    name: string;
    code: string;
    description: string;
    is_active: boolean;
}

export function mapMajor(data: ApiMajor): Major {
    return {
        id: data.id,
        name: data.name,
        code: data.code,
        description: data.description,
        status: data.is_active ? "Active" : "Inactive",
    }
}