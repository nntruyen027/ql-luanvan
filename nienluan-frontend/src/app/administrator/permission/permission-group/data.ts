import {PermissionGroup} from "@/types/permission";

export const initialData: PermissionGroup[] = [
    {
        id: 1,
        name: 'Tra cứu',
        permissions: [
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
        ]
    },
    {
        id: 2,
        name: 'Thống kê',
        permissions: [
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
        ]
    },
];
