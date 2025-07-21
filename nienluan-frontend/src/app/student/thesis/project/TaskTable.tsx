'use client';

import { EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { ThesisTask } from '@/types/thesisTask';
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<ThesisTask>;
    onEdit: (task: ThesisTask) => void;
    onView: (task: ThesisTask) => void;
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
    onView,
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
                const isFinished = record.status === 'finished';
                const items = [];

                // Kiểm tra quyền xem chi tiết
                if (hasPermission('edit:thesis-task')) {
                    items.push({
                        key: 'view',
                        icon: <EyeOutlined />,
                        label: 'Xem chi tiết',
                    });
                }

                // Kiểm tra quyền cập nhật và chưa hoàn thành
                if (!isFinished && hasPermission('edit:thesis-task')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Cập nhật',
                    });
                }

                // Không có quyền nào thì không hiển thị dropdown
                if (items.length === 0) return null;

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items,
                            onClick: ({ key }) => {
                                if (key === 'edit') onEdit(record);
                                if (key === 'view') onView(record);
                            },
                        }}
                    >
                        <MoreOutlined className="rotate-90 cursor-pointer" />
                    </Dropdown>
                );
            }}
        />
    );

};

export default TaskTable;
