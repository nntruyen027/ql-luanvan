import { Permission } from "@/types/permission";



interface ApiPermission {
    id: number;
    module: string;
    action: string;
    code: string;
}

export function mapPermisson(data: ApiPermission): Permission {
    return {
        id: data.id,
        module: data.module,
        action: data.action,
        code: data.code
    }
}