'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import Table from '@/components/Table';
import type { PageData } from '@/components/Table';
import { Key } from 'react';
import { AcademicYear } from "@/types/academicYear";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<AcademicYear>;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onEdit: (item: AcademicYear) => void;
    confirmDelete: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean;
    currentPage: number;
    pageSize: number;
};

const AcademicYearTable = ({ data, onTableChange, onEdit, confirmDelete,
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
            title: 'Tên năm học',
            dataIndex: 'name',
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
            render: (value: AcademicYear['status']) => (
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
            rowKey="id"
            loading={loading}
            onChange={onTableChange}
            actions={(record) => {
                const menuItems = [];

                if (hasPermission('edit:academic-years')) {
                    menuItems.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                if (hasPermission('delete:academic-years')) {
                    menuItems.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Không render Dropdown nếu không có quyền nào
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

export default AcademicYearTable;
