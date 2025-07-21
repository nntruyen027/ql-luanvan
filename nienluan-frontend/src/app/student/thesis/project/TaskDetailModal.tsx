'use client';

import { Form, Modal, Typography, Tag, Button } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ThesisTask } from '@/types/thesisTask';
import type { UploadFile } from 'antd/es/upload/interface';

const { Text } = Typography;

const statusTagMap = {
    notstarted: {
        color: 'default',
        label: 'Chưa thực hiện',
    },
    doing: {
        color: 'processing',
        label: 'Đang thực hiện',
    },
    finished: {
        color: 'success',
        label: 'Hoàn thành',
    },
};

type Props = {
    open: boolean;
    edittingTask?: ThesisTask | null;
    onCancel: () => void;
};

const TaskDetailModal = ({ open, edittingTask, onCancel }: Props) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (open) {
            const hanChot = dayjs(edittingTask?.deadline, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            if (edittingTask) {
                // Khởi tạo danh sách file
                const initialFiles = edittingTask.attachments?.map(file => ({
                    uid: file.id.toString(),
                    name: file.fileName,
                    status: 'done',
                    url: `http://localhost:8000${file.filePath}`,
                })) || [];

                setFileList(initialFiles);
                form.setFieldsValue({
                    deTai: edittingTask.thesis.id,
                    tenCongViec: edittingTask.title,
                    moTa: edittingTask.description,
                    hanChot: hanChot.isValid() ? hanChot : null,
                    trangThai: edittingTask.status,
                    tepDinhKem: initialFiles
                });
            } else {
                form.resetFields();
                setFileList([])
            }
        }
    }, [edittingTask, open, form]);



    return (
        <Modal
            open={open}
            title={'Chi tiết công việc'}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
            centered
        >

            <div style={{ marginBottom: 16 }}>
                <Text strong>Tên công việc: </Text>
                <Text>{edittingTask?.title || 'Không có dữ liệu'}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text strong>Mô tả: </Text>
                <Text>{edittingTask?.description || 'Không có mô tả'}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text strong>Hạn chót: </Text>
                <Text>
                    {edittingTask?.deadline || 'Không có hạn chót'}
                </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text strong>Trạng thái: </Text>
                {edittingTask?.status ? (
                    <Tag color={statusTagMap[edittingTask.status]?.color}>
                        {statusTagMap[edittingTask.status]?.label || 'Không xác định'}
                    </Tag>
                ) : (
                    <Tag color="default">Không xác định</Tag>
                )}
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text strong>Tệp đính kèm: </Text>
                {fileList.length > 0 ? (
                    <ul>
                        {fileList.map(file => (
                            <li key={file.uid}>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    {file.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Text>Không có tệp đính kèm</Text>
                )}
            </div>

        </Modal>
    );
};

export default TaskDetailModal;
