'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Popconfirm, Tooltip } from 'antd';
import type { Key } from 'react';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Committee } from "@/types/committee";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Committee>;
    onEdit: (item: Committee) => void;
    confirmDelete: (id: number) => void;
    onDelete: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
    loading: boolean,
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    currentPage: number;
    pageSize: number;
};

const CommitteeTable = ({
    data,
    onEdit,
    confirmDelete,
    onSelectionChange,
    loading,
    onTableChange,
    currentPage,
    pageSize }: Props) => {
    const { hasPermission } = usePermission();
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            fixed: 'left',
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên đề tài',
            dataIndex: ['thesis', 'name'],
            key: 'name',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Sinh viên',
            dataIndex: 'students',
            key: 'student',
            render: (_: any, record: any) => {
                const students = record.thesis.registrations.students;

                return (
                    <div className="text-sm space-y-1">
                        {students.map((student: any, index: number) => (
                            <div key={index}>
                                <span className="text-black">{student.name}</span>
                            </div>
                        ))}
                    </div>

                );
            },
        },
        {
            title: 'Giảng viên hướng dẫn',
            dataIndex: ['thesis', 'lecturer', 'name'],
            key: 'lecturer',
        },
        {
            title: 'Năm học',
            dataIndex: ['thesis', 'reportPeriod', 'semester', 'year', 'name'],
            key: 'year',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Kỳ học',
            dataIndex: ['thesis', 'reportPeriod', 'semester', 'name'],
            key: 'semester',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Kỳ báo cáo',
            dataIndex: ['thesis', 'reportPeriod', 'name'],
            key: 'reportPeriod',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Hội đồng luận văn',
            dataIndex: 'committee',
            key: 'committee',
            render: (_: any, record: any) => {
                const members = record.members;

                return (
                    <div className="text-sm space-y-1">
                        {members.map((member: any, index: number) => (
                            <div key={index}>
                                <span className="font-bold text-black">{member.position}:</span> {member.user.name}
                            </div>
                        ))}
                    </div>

                );
            },
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

                // Kiểm tra quyền 'edit'
                if (hasPermission('edit:defense-committee')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                // Kiểm tra quyền 'delete'
                if (hasPermission('delete:defense-committee')) {
                    items.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Nếu không có hành động nào được phép thì không hiển thị dropdown
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

export default CommitteeTable;
