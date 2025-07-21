'use client';

import { DeleteOutlined, EditOutlined, FormOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import type { Key } from 'react';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { ThesisTask } from '@/types/thesisTask';
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<ThesisTask>;
    onEdit: (task: ThesisTask) => void;
    onSelectionChange: (keys: Key[]) => void;
    confirmDelete: (id: number) => void;
    onReview: (task: ThesisTask) => void;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    loading: boolean,
    currentPage: number;
    pageSize: number;
};

const TaskTable = ({
    data,
    onEdit,
    onSelectionChange,
    confirmDelete,
    onReview,
    onTableChange,
    loading,
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
            title: 'Tiêu đề task',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Hạn chót',
            dataIndex: 'deadline',
            key: 'deadline',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value: ThesisTask['status']) => {
                const statusMap: Record<ThesisTask['status'], { label: string; color: string }> = {
                    notstarted: { label: 'Chưa thực hiện', color: 'default' },
                    doing: { label: 'Đang thực hiện', color: 'blue' },
                    finished: { label: 'Hoàn thành', color: 'green' },
                    cancelled: { label: 'Đã hủy', color: 'red' },
                };

                const { label, color } = statusMap[value] || { label: 'Không xác định', color: 'default' };

                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'GV đánh giá',
            dataIndex: 'instructorStatus',
            key: 'deadline',
            render: (value: ThesisTask['instructorStatus']) => {
                const statusMap: Record<ThesisTask['instructorStatus'], { label: string; color: string }> = {
                    passed: { label: 'Đạt', color: 'green' },
                    failed: { label: 'Không đạt', color: 'red' }
                };

                const { label, color } = statusMap[value] || { label: 'Chưa đánh giá', color: 'default' };

                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'GV ghi chú',
            dataIndex: 'instructorNote',
            key: 'deadline',
        },

    ];

    return (
        <Table
            columns={columns}
            data={data}
            rowKey="id"
            onChange={onTableChange}
            loading={loading}
            actions={(record) => {
                const items = [];

                // Kiểm tra quyền đánh giá
                if (hasPermission('edit:thesis-task')) {
                    items.push({
                        key: 'review',
                        icon: <FormOutlined />,
                        label: 'Đánh giá',
                    });
                }

                // Kiểm tra quyền sửa
                if (hasPermission('edit:thesis-task')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                // Kiểm tra quyền xóa
                if (hasPermission('delete:thesis-task')) {
                    items.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Nếu không có quyền nào, không hiển thị dropdown
                if (items.length === 0) return null;

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items,
                            onClick: ({ key }) => {
                                if (key === 'review') onReview(record);
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

export default TaskTable;
