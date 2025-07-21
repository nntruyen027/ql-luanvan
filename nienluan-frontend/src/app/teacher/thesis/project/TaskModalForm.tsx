'use client';

import { DatePicker, Form, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ThesisRegister } from '@/types/thesisRegister';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { addThesisTask, updateThesisTask } from './thesisTaskService';
import { ThesisTask } from '@/types/thesisTask';

type Props = {
    open: boolean;
    edittingTask?: ThesisTask | null;
    onCancel: () => void;
    onOk: () => void;
    thesis: ThesisRegister
};

const TaskModalForm = ({ open, edittingTask, onCancel, onOk, thesis }: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedThesis, setSelectedThesis] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const hanChot = dayjs(edittingTask?.deadline, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);

            if (edittingTask) {
                form.setFieldsValue({
                    deTai: edittingTask.thesis.id,
                    tenCongViec: edittingTask.title,
                    moTa: edittingTask.description,
                    hanChot: hanChot.isValid() ? hanChot : null,
                    trangThai: edittingTask.status
                });
            } else {
                form.resetFields();
            }
        }
    }, [edittingTask, open, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                thesis_id: values.deTai,
                title: values.tenCongViec,
                description: values.moTa,
                deadline: values.hanChot.format("YYYY-MM-DD"),
                status: values.trangThai,
            };

            if (!edittingTask) {
                const response = await addThesisTask(payload);
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
                const response = await updateThesisTask(edittingTask.id, payload);
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
            title={edittingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Lưu"
            centered
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Đề tài" name="deTai" rules={[{ required: true, message: 'Vui lòng chọn đề tài' }]}>
                    <Select
                        placeholder="Chọn đề tài"
                        value={selectedThesis}
                        onChange={setSelectedThesis}
                        style={{ minWidth: 250 }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {thesis.map(project => (
                            <Select.Option key={project.thesis.id} value={project.thesis.id}>
                                {project.thesis.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Tên công việc" name="tenCongViec" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="moTa">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Hạn chót" name="hanChot" rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { label: 'Chưa thực hiện', value: 'notstarted' },
                            { label: 'Đang thực hiện', value: 'doing' },
                            { label: 'Hoàn thành', value: 'finished' },
                            { label: 'Đã hủy', value: 'cancelled' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskModalForm;
