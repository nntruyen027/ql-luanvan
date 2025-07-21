'use client';

import { Button, Form, Modal, Select, Typography, Upload } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { studentUpdateThesisTask } from './thesisTaskService';
import { ThesisTask } from '@/types/thesisTask';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Text } = Typography;

type Props = {
    open: boolean;
    edittingTask?: ThesisTask | null;
    onCancel: () => void;
    onOk: () => void;
};

const TaskModalForm = ({ open, edittingTask, onCancel, onOk }: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

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

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const hasNewFile = values.tepDinhKem?.fileList?.some(file => !!file.originFileObj);
            if (hasNewFile) {
                // Có file đính kèm
                const formData = new FormData();

                formData.append('status', values.trangThai);

                //Gửi từng file trong tepDinhKem.fileList
                values.tepDinhKem?.fileList?.forEach((fileObj) => {
                    if (fileObj.originFileObj) {
                        formData.append('attachments[]', fileObj.originFileObj);
                    }
                });

                if (deletedFileIds.length > 0) {
                    formData.append('deleted_files', JSON.stringify(deletedFileIds));
                }

                const response = await studentUpdateThesisTask(edittingTask.id, formData);
                const responseData = { message: response.data.message, type: response.data.status };
                if (responseData.type === 'success') {
                    dispatch(showNotification(responseData));
                    toast.success(responseData.message, {
                        position: "top-right"
                    });
                }
                else {
                    dispatch(showNotification(responseData));
                    toast.error(responseData.message, {
                        position: "top-right"
                    });
                }

            } else {
                // Không có file đính kèm
                const payload = {
                    status: values.trangThai,
                    deleted_files: JSON.stringify(deletedFileIds), // vẫn nên gửi nếu có
                };

                const response = await studentUpdateThesisTask(edittingTask.id, payload);
                const responseData = { message: response.data.message, type: response.data.status };
                if (responseData.type === 'success') {
                    dispatch(showNotification(responseData));
                    toast.success(responseData.message, {
                        position: "top-right"
                    });
                }
                else {
                    dispatch(showNotification(responseData));
                    toast.error(responseData.message, {
                        position: "top-right"
                    });
                }
            }

            form.resetFields();
            onOk();
            setLoading(false);
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).forEach((fieldErrors: any) => {
                    fieldErrors.forEach((msg: string) => {
                        toast.error(msg);
                    });
                });
            } else {
                const fallback = error.response?.data;
                if (fallback?.message) {
                    dispatch(showNotification({ message: fallback.message, type: fallback.status }));
                    toast.error(fallback.message);
                } else {
                    toast.error("Đã xảy ra lỗi không xác định.");
                }
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal
            open={open}
            title={edittingTask ? 'Cập nhật tiến độ công việc' : 'Thêm công việc'}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Lưu"
            centered
            confirmLoading={loading}
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

            {/* Form chỉnh sửa trạng thái */}
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Trạng thái"
                    name="trangThai"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select
                        options={[
                            { label: 'Chưa thực hiện', value: 'notstarted' },
                            { label: 'Đang thực hiện', value: 'doing' },
                            { label: 'Hoàn thành', value: 'finished' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="tepDinhKem"
                    label="Tệp đính kèm"
                    extra="Bạn có thể tải lên nhiều tệp"
                >
                    <Upload
                        multiple
                        fileList={fileList}
                        onChange={({ file, fileList }) => {
                            setFileList(fileList);

                            if (file.status === 'removed' && file.uid && !file.originFileObj) {
                                // Nếu là file cũ (không phải file mới upload), thì lưu ID vào deletedFileIds
                                const removedId = parseInt(file.uid, 10);
                                if (!isNaN(removedId)) {
                                    setDeletedFileIds((prev) => [...prev, removedId]);
                                }
                            }
                        }}
                        beforeUpload={() => false}
                        accept=".pdf,.doc,.docx,.zip"
                    >
                        <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskModalForm;
