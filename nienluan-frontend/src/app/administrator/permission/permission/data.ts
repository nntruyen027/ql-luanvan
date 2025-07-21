import {Permission} from "@/types/permission";

export const initialData: Permission[] = [
    {
        id: 1,
        action: 'view',
        module: 'user',
        code: 'view:user'
    },
    {
        id: 2,
        action: 'delete',
        module: 'user',
        code: 'delete:user'
    }
];
