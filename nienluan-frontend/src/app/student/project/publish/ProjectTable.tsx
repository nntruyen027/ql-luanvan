'use client';

import { InfoCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Thesis } from '@/types/thesisAndThesisAttachment';

type Props = {
    data: PageData<Thesis>;
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
    loading,
    onTableChange,
    currentPage,
    pageSize
}: Props) => {
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
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-1">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Giảng viên hướng dẫn',
            dataIndex: ['lecturer', 'name'],
            key: 'lecturer',
            render: (text: string, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="line-clamp-1" style={{ color: '#1890ff' }}>{text}</span>
                    <Tooltip
                        title={
                            <>
                                <div><strong>Email:</strong> {record.lecturer?.email}</div>
                                <div><strong>Số điện thoại:</strong> {record.lecturer?.phone_number}</div>
                            </>
                        }
                    >
                        <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
                    </Tooltip>
                </div>
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
            onChange={onTableChange}
            rowKey="id"
            loading={loading}
        />
    );
};

export default ProjectTable;
