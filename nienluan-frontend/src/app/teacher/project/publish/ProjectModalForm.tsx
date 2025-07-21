'use client';

import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { addThesis, getReportPeriodOptions, updateThesis } from './thesisPublishService';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Thesis } from '@/types/thesisAndThesisAttachment';

type Props = {
    open: boolean;
    editingProject: Thesis | null;
    onCancel: () => void;
    onOk: () => void;
};

type ReportPeriodOptions = {
    value: number;
    label: string;
};


const ProjectModalForm = ({
    open,
    editingProject,
    onCancel,
    onOk,
}: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
    const [periodReportOptions, setPeriodReportOptions] = useState<ReportPeriodOptions[]>([]);
    const [loading, setLoading] = useState(false);


    const loadReportPeriodOptions = async () => {
        const response = await getReportPeriodOptions();
        setPeriodReportOptions(response.data);
    }

    useEffect(() => {
        if (open) {
            loadReportPeriodOptions();
            const ngayBatDau = dayjs(editingProject?.startDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            const ngayKetThuc = dayjs(editingProject?.endDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            if (editingProject) {

                // Khởi tạo danh sách file
                const initialFiles = editingProject.attachments?.map(file => ({
                    uid: file.id.toString(),
                    name: file.fileName,
                    status: 'done',
                    url: `http://localhost:8000${file.filePath}`,
                })) || [];

                setFileList(initialFiles);
                form.setFieldsValue({
                    tenDeTai: editingProject.name,
                    moTa: editingProject.description,
                    kyBaoCao: editingProject.reportPeriod.id,
                    ngayBatDau: ngayBatDau.isValid() ? ngayBatDau : null,
                    ngayKetThuc: ngayKetThuc.isValid() ? ngayKetThuc : null,
                    tepDinhKem: initialFiles
                });
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [editingProject, open, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (!editingProject) {
                if (values.tepDinhKem?.fileList?.length > 0) {
                    // Có file đính kèm
                    const formData = new FormData();

                    formData.append('name', values.tenDeTai);
                    formData.append('description', values.moTa || '');
                    formData.append('report_period_id', values.kyBaoCao);
                    formData.append('start_date', values.ngayBatDau.format("YYYY-MM-DD"));
                    formData.append('end_date', values.ngayKetThuc.format("YYYY-MM-DD"));

                    //Gửi từng file trong tepDinhKem.fileList
                    values.tepDinhKem?.fileList?.forEach((fileObj) => {
                        if (fileObj.originFileObj) {
                            formData.append('attachments[]', fileObj.originFileObj);
                        }
                    });

                    if (deletedFileIds.length > 0) {
                        formData.append('deleted_files', JSON.stringify(deletedFileIds));
                    }

                    const response = await addThesis(formData);
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
                        name: values.tenDeTai,
                        report_period_id: values.kyBaoCao,
                        start_date: values.ngayBatDau.format('YYYY-MM-DD'),
                        end_date: values.ngayKetThuc.format('YYYY-MM-DD'),
                        description: values.moTa || '',
                        deleted_files: JSON.stringify(deletedFileIds), // vẫn nên gửi nếu có
                    };

                    const response = await addThesis(payload);
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
            } else {
                const hasNewFile = values.tepDinhKem?.fileList?.some(file => !!file.originFileObj);
                if (hasNewFile) {
                    // Có file đính kèm
                    const formData = new FormData();

                    formData.append('name', values.tenDeTai);
                    formData.append('description', values.moTa);
                    formData.append('report_period_id', values.kyBaoCao);
                    formData.append('start_date', values.ngayBatDau.format("YYYY-MM-DD"));
                    formData.append('end_date', values.ngayKetThuc.format("YYYY-MM-DD"));

                    //Gửi từng file trong tepDinhKem.fileList
                    values.tepDinhKem?.fileList?.forEach((fileObj) => {
                        if (fileObj.originFileObj) {
                            formData.append('attachments[]', fileObj.originFileObj);
                        }
                    });

                    if (deletedFileIds.length > 0) {
                        formData.append('deleted_files', JSON.stringify(deletedFileIds));
                    }

                    const response = await updateThesis(editingProject.id, formData);
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
                        name: values.tenDeTai,
                        report_period_id: values.kyBaoCao,
                        start_date: values.ngayBatDau.format('YYYY-MM-DD'),
                        end_date: values.ngayKetThuc.format('YYYY-MM-DD'),
                        description: values.moTa || '',
                        deleted_files: JSON.stringify(deletedFileIds), // vẫn nên gửi nếu có
                    };

                    const response = await updateThesis(editingProject.id, payload);
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

            }

            form.resetFields();
            onOk();
            setFileList([]);
            setDeletedFileIds([]);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            const errors = error.response.data.errors;
            if (errors || errors != undefined) {
                Object.values(errors).forEach((fieldErrors: any) => {
                    fieldErrors.forEach((msg: string) => {
                        toast.error(msg, {
                            position: 'top-right',
                        });
                    });
                });
            }
            else {
                const responseData = { message: error.response.data.message, type: error.response.data.status };
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }

        }
    };

    return (
        <Modal
            open={open}
            title={editingProject ? 'Chỉnh sửa đề tài luận văn' : 'Thêm đề tài luận văn'}
            onCancel={() => {
                form.resetFields();
                setFileList([]);
                onCancel();
            }}
            onOk={handleSubmit}
            okText={editingProject ? 'Cập nhật' : 'Thêm mới'}
            confirmLoading={loading}
            centered
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenDeTai"
                    label="Tên đề tài"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đề tài' }]}
                >
                    <Input placeholder="VD: Ứng dụng AI trong giáo dục" />
                </Form.Item>

                <Form.Item
                    name="moTa"
                    label="Mô tả"
                >
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về đề tài" />
                </Form.Item>

                <Form.Item
                    name="kyBaoCao"
                    label="Kỳ báo cáo"
                    rules={[{ required: true, message: 'Vui lòng chọn kỳ báo cáo' }]}
                >
                    <Select placeholder="Chọn kỳ báo cáo">
                        {periodReportOptions.map((p) => (
                            <Select.Option key={p.value} value={p.value}>
                                {p.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ngayBatDau"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="ngayKetThuc"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
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

export default ProjectModalForm;
