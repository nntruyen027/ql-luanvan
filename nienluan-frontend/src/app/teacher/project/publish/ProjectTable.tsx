'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined, PaperClipOutlined, RetweetOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import type { Key } from 'react';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Project } from "@/types/project";
import { Thesis } from '@/types/thesisAndThesisAttachment';
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Thesis>;
    onEdit: (item: Project) => void;
    confirmDelete: (id: number) => void;
    confirmRegister: (id: number) => void;
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

const ProjectTable = ({
    data,
    onEdit,
    confirmDelete,
    confirmRegister,
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
            title: 'Tên đề tài',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Năm học',
            dataIndex: ['reportPeriod', 'semester', 'year', 'name'],
            key: 'year',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Kỳ học',
            dataIndex: ['reportPeriod', 'semester', 'name'],
            key: 'semester',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Kỳ báo cáo',
            dataIndex: ['reportPeriod', 'name'],
            key: 'reportPeriod',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Mô tả',
            key: 'description',
            render: (_: any, record: any) => {
                const description = record.description;
                const attachments = record.attachments || [];

                return (
                    <div>
                        <Tooltip title={description}>
                            <div className="line-clamp-1">{description}</div>
                        </Tooltip>

                        {attachments.length > 0 && (
                            <ul className="mt-1 text-sm text-blue-600">
                                {attachments.map((file: any, index: number) => (
                                    <li key={index}>
                                        <a href={`http://localhost:8000${file.filePath}`} target="_blank" rel="noopener noreferrer">
                                            <PaperClipOutlined /> {file.fileName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Ngày công bố',
            dataIndex: 'startDate',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
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

                // Kiểm tra quyền 'register'
                if (hasPermission('edit:thesis-publish')) {
                    items.push({
                        key: 'register',
                        icon: <RetweetOutlined />,
                        label: 'Đăng ký đề tài',
                    });
                }

                // Kiểm tra quyền 'edit'
                if (hasPermission('edit:thesis-publish')) {
                    items.push({
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                    });
                }

                // Kiểm tra quyền 'delete'
                if (hasPermission('delete:thesis-publish')) {
                    items.push({
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                    });
                }

                // Nếu không có hành động nào được phép, không render dropdown
                if (items.length === 0) return null;

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items,
                            onClick: ({ key }) => {
                                if (key === 'register') confirmRegister(record.id);
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

export default ProjectTable;
