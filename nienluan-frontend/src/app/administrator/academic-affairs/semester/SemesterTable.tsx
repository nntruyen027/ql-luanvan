'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Key } from 'react';
import { Semester } from "@/types/semester";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Semester>;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onEdit: (item: Semester) => void;
    confirmDelete: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean;
    currentPage: number;
    pageSize: number;
};

const SemesterTable = ({ data, onTableChange, onEdit, confirmDelete,
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
            title: 'Tên kỳ học',
            dataIndex: 'name',
        },
        {
            title: 'Năm học',
            dataIndex: ['year', 'name'],
            key: 'year',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: Semester['status']) => (
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

                if (hasPermission('edit:semesters')) {
                    menuItems.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                if (hasPermission('delete:semesters')) {
                    menuItems.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Nếu không có quyền nào thì không hiển thị dropdown
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
                        <MoreOutlined className="rotate-90" />
                    </Dropdown>
                );
            }}
            onSelectionChange={onSelectionChange}
        />
    );

};

export default SemesterTable;
