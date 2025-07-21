'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Key } from 'react';
import { Major } from "@/types/major";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Major>;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onEdit: (item: Major) => void;
    confirmDelete: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean,
    currentPage: number;
    pageSize: number;
};

const MajorTable = ({ data, onTableChange, onEdit, confirmDelete,
    onSelectionChange, loading, currentPage, pageSize }: Props) => {
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
        {
            title: 'Tên ngành',
            dataIndex: 'name',
        },
        {
            title: 'Mã ngành',
            dataIndex: 'code',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: Major['status']) => (
                <Tag color={value === 'Active' ? 'green' : 'default'}>
                    {value === 'Active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            loading={loading}
            rowKey="id"
            onChange={onTableChange}
            actions={(record) => {
                const menuItems = [];

                // Kiểm tra quyền 'edit'
                if (hasPermission('edit:majors')) {
                    menuItems.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                // Kiểm tra quyền 'delete'
                if (hasPermission('delete:majors')) {
                    menuItems.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Không render nếu không có quyền nào
                if (menuItems.length === 0) return null;

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: menuItems,
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

export default MajorTable;
