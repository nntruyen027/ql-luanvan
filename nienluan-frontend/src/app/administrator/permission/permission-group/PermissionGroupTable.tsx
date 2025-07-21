'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Popconfirm } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Key } from 'react';
import { PermissionGroup } from "@/types/permission";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<PermissionGroup>;
    onEdit: (student: PermissionGroup) => void;
    confirmDelete: (id: number) => void;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean,
    currentPage: number;
    pageSize: number;
};

const PermissionGroupTable = ({ data, onEdit, confirmDelete,
    onTableChange, onSelectionChange, loading, currentPage, pageSize }: Props) => {
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
        { title: 'Tên nhóm quyền', dataIndex: 'name' },
        {
            title: 'Danh sách quyền',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions: PermissionGroup['permissions']) => {
                const maxDisplay = 3;
                const displayed = permissions.slice(0, maxDisplay).map(p => p.code);
                const remaining = permissions.length - maxDisplay;

                return (
                    <span title={permissions.map(p => p.code).join(', ')}>
                        {displayed.join(', ')}
                        {remaining > 0 && `, ...và ${remaining} quyền khác`}
                    </span>
                );
            },
        }
    ];

    return (
        <Table
            columns={columns}
            data={data}
            rowKey="id"
            loading={loading}
            onChange={onTableChange}
            actions={(record) => {
                const items = [];

                if (hasPermission('edit:permission-groups')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                if (hasPermission('delete:permission-groups')) {
                    items.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                if (items.length === 0) return null; // Không có quyền thì không hiển thị gì

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items,
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

export default PermissionGroupTable;
