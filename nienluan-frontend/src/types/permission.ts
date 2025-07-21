export type Permission = {
    id: number;
    module: string;
    action: string;
    code: string;
};

export type PermissionGroup = {
    id: number;
    name: string;
    permissions?: Permission[];
};
