'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Popconfirm, Tag } from 'antd';
import type { Key } from 'react';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { ThesisReportPeriod } from "@/types/thesisReportPeriod";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<ThesisReportPeriod>;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    onEdit: (item: ThesisReportPeriod) => void;
    confirmDelete: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean,
    currentPage: number;
    pageSize: number;
};

const ThesisReportPeriodTable = ({
    data,
    onTableChange,
    onEdit,
    confirmDelete,
    onSelectionChange,
    loading,
    currentPage,
    pageSize }: Props) => {

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
            title: 'Tên kỳ báo cáo',
            dataIndex: 'name',
        },
        {
            title: 'Học kỳ',
            dataIndex: ['semester', 'name'],
            key: 'semester',
        },
        {
            title: 'Năm học',
            dataIndex: ['semester', 'year', 'name'],
            key: 'academicYear',
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
            render: (value: ThesisReportPeriod['status']) => (
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
                const items = [];

                // Kiểm tra quyền sửa
                if (hasPermission('edit:registration-period')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                // Kiểm tra quyền xóa
                if (hasPermission('delete:registration-period')) {
                    items.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Không hiển thị gì nếu không có quyền nào
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
                        <MoreOutlined className="rotate-90" />
                    </Dropdown>
                );
            }}
            onSelectionChange={onSelectionChange}
        />
    );

};

export default ThesisReportPeriodTable;
