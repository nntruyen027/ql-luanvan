import { Permission, PermissionGroup } from "@/types/permission";


interface ApiPermission {
    id: number;
    module: string;
    action: string;
    code: string;
}

interface ApiPermissionGroup {
    id: number;
    name: string;
    permissions: ApiPermission[]
}

export function mapPermissonGroup(data: ApiPermissionGroup): PermissionGroup {
    return {
        id: data.id,
        name: data.name,
        permissions: data.permissions.map((permission): Permission => ({
            id: permission.id,
            module: permission.module,
            action: permission.action,
            code: permission.code
        })),
    }
}