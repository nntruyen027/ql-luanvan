'use client';

import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag, Tooltip } from 'antd';
import { Key, useState } from 'react';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { ThesisRegister } from '@/types/thesisRegister';
import ProjectModalModalForm from './ProjectModalForm';
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<ThesisRegister>;
    loading: boolean;
    onApproved: (id: number) => void;
    onRejected: (id: number) => void;
    onSelectionChange: (keys: Key[]) => void;
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
    onApproved,
    onRejected,
    onSelectionChange,
    onTableChange,
    currentPage,
    pageSize
}: Props) => {
    const { hasPermission } = usePermission();
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedThesisRegister, setSelectedThesisRegister] = useState<ThesisRegister>();

    const handleViewDetail = (thesisRegister: ThesisRegister) => {
        setDetailModalOpen(false);
        setTimeout(() => {
            setSelectedThesisRegister({ ...thesisRegister });
            setDetailModalOpen(true);
        }, 0);
    };

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
            key: 'students',
            render: (_: any, record: any) => {
                const students = record.student;

                return (
                    <div className="text-sm text-blue-600 space-y-1">
                        {students.map((student: any, index: number) => (
                            <div key={index}>{student.name}</div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: 'Giảng viên hướng dẫn',
            dataIndex: ['thesis', 'lecturer', 'name'],
            key: 'lecturer'
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value: ThesisRegister['status']) => {
                const colorMap = {
                    pending: 'default',
                    approved: 'green',
                    rejected: 'red',
                };
                const labelMap = {
                    pending: 'Chờ duyệt',
                    approved: 'Đã duyệt',
                    rejected: 'Từ chối',
                };
                return <Tag color={colorMap[value]}>{labelMap[value]}</Tag>;
            },
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                data={data}
                rowKey="id"
                loading={loading}
                onChange={onTableChange}
                actions={(record) => {
                    const isPending = record.status === 'pending';
                    const isApproved = record.status === 'approved';

                    const items = [];

                    // Xem chi tiết (luôn có quyền)
                    if (hasPermission('edit:registered-topics')) {
                        items.push({
                            key: 'detail',
                            label: (
                                <span
                                    className="flex items-center gap-2"
                                    onClick={() => handleViewDetail(record)}
                                >
                                    <InfoCircleOutlined />
                                    Xem chi tiết
                                </span>
                            ),
                        });
                    }

                    // Nếu pending thì xét thêm quyền duyệt và từ chối
                    if (isPending && !isApproved) {
                        if (hasPermission('edit:registered-topics')) {
                            items.push({
                                key: 'approve',
                                label: (
                                    <span
                                        className="flex items-center gap-2"
                                        style={{ color: 'green' }}
                                        onClick={() => onApproved(record.thesis.id)}
                                    >
                                        <CheckCircleOutlined />
                                        Duyệt
                                    </span>
                                ),
                            });
                        }

                        if (hasPermission('edit:registered-topics')) {
                            items.push({
                                key: 'reject',
                                label: (
                                    <span
                                        className="flex items-center gap-2"
                                        style={{ color: 'red' }}
                                        onClick={() => onRejected(record.thesis.id)}
                                    >
                                        <CloseCircleOutlined />
                                        Từ chối
                                    </span>
                                ),
                            });
                        }
                    }

                    // Không có quyền nào thì không render dropdown
                    if (items.length === 0) return null;

                    return (
                        <Dropdown trigger={['click']} menu={{ items }}>
                            <MoreOutlined className="rotate-90 cursor-pointer" />
                        </Dropdown>
                    );
                }}
                onSelectionChange={onSelectionChange}
            />

            <ProjectModalModalForm
                open={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    setSelectedThesisRegister(null);
                }}
                detail={selectedThesisRegister}
            />
        </>
    );

};

export default ProjectTable;
