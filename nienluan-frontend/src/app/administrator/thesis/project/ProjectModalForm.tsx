'use client';

import { Modal, Tag } from 'antd';
import { ThesisRegister } from '@/types/thesisRegister';
import { PaperClipOutlined } from '@ant-design/icons';

type Props = {
    open: boolean;
    onClose: () => void;
    detail: ThesisRegister;
};

const ProjectModalModalForm = ({ open, onClose, detail }: Props) => {
    if (!detail) return null;

    const renderStatus = (value) => {
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
    };

    return (
        <Modal
            title="Chi tiết đề tài"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <p><strong>Tên đề tài:</strong> {detail.thesis.name}</p>

            <div>
                <p style={{ marginBottom: '0.1em' }}><strong>Mô tả:</strong> {detail.thesis.description}</p>

                {detail.thesis.attachments.length > 0 && (
                    <ul className="mt-1 text-sm text-blue-600">
                        {detail.thesis.attachments.map((file: any, index: number) => (
                            <li key={index}>
                                <a href={`http://localhost:8000${file.filePath}`} target="_blank" rel="noopener noreferrer">
                                    <PaperClipOutlined /> {file.fileName}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <p><strong>Trạng thái:</strong> {renderStatus(detail.status)}</p>
            <p><strong>Giảng viên hướng dẫn:</strong> {detail.thesis.lecturer.name}</p>
            <p><strong>Năm học:</strong> {detail.thesis.reportPeriod.semester.year?.name}</p>
            <p><strong>Kỳ học:</strong> {detail.thesis.reportPeriod.semester.name}</p>
            <p><strong>Kỳ báo cáo:</strong> {detail.thesis.reportPeriod.name}</p>

            <div>
                <strong>Sinh viên:</strong>
                <ul className="ml-4 list-disc">
                    {detail.student.map((s) => (
                        <li key={s.id}>{s.name}</li>
                    ))}
                </ul>
            </div>
        </Modal>

    );
};

export default ProjectModalModalForm;
