'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Key } from 'react';
import { Permission } from "@/types/permission";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Permission>;
    onEdit: (student: Permission) => void;
    confirmDelete: (id: number) => void;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean;
    currentPage: number;
    pageSize: number;
};

const PermissionTable = ({ data, onEdit, confirmDelete, onTableChange, onSelectionChange, loading, currentPage, pageSize }: Props) => {
    const { hasPermission } = usePermission();

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        { title: 'Module', dataIndex: 'module' },
        { title: 'Hành động', dataIndex: 'action' },
        { title: 'Mã quyền', dataIndex: 'code' },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            rowKey="id"
            loading={loading}
            onChange={onTableChange}
            actions={(record) => {
                // Định nghĩa các mục hành động với quyền tương ứng
                const menuItems = [
                    {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                        permission: 'edit:permissions',
                    },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                        permission: 'delete:permissions',
                    },
                ];

                // Lọc các mục theo quyền người dùng
                const filteredItems = menuItems.filter(item => hasPermission(item.permission));

                // Nếu không có quyền nào → ẩn luôn dropdown
                if (filteredItems.length === 0) return null;

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: filteredItems,
                            onClick: ({ key }) => {
                                if (key === 'edit') onEdit(record);
                                if (key === 'delete') confirmDelete(record.id);
                            },
                        }}
                    >
                        <MoreOutlined className="rotate-90 cursor-pointer" />
                    </Dropdown>
                );
            }}
            onSelectionChange={onSelectionChange}
        />
    );

};

export default PermissionTable;
