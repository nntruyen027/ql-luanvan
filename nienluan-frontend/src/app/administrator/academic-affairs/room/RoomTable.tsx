'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Room } from '@/types/room';
import { Key } from 'react';
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Room>;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onEdit: (item: Room) => void;
    confirmDelete: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean;
    currentPage: number;
    pageSize: number;
};

const RoomTable = ({
    data,
    onEdit,
    confirmDelete,
    onSelectionChange,
    loading,
    onTableChange,
    currentPage,
    pageSize
}: Props) => {
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
            title: 'Tên phòng',
            dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: Room['status']) => (
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
                const items = [];

                if (hasPermission('edit:classroom-list')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                if (hasPermission('delete:classroom-list')) {
                    items.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                if (items.length === 0) return null;

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

export default RoomTable;
