'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { Major } from "@/types/major";
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { addMajor, updateMajor } from './majorService';

type Props = {
    open: boolean;
    editingMajor: Major | null;
    onCancel: () => void;
    onOk: () => void;
};

const MajorModalForm = ({
    open,
    editingMajor,
    onCancel,
    onOk,
}: Props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingMajor) {
                form.setFieldsValue({
                    tenNganh: editingMajor.name,
                    maNganh: editingMajor.code,
                    moTa: editingMajor.description,
                    trangThai: editingMajor.status
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingMajor, open, form]);


    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                name: values.tenNganh,
                code: values.maNganh,
                description: values.moTa,
                is_active: values.trangThai === "Active",
            };

            if (!editingMajor) {
                const response = await addMajor(payload);
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
                const response = await updateMajor(editingMajor.id, payload);
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
    }

    return (
        <Modal
            open={open}
            title={editingMajor ? 'Chỉnh sửa ngành học' : 'Thêm ngành học'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingMajor ? 'Cập nhật' : 'Thêm mới'}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenNganh"
                    label="Tên ngành"
                    rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
                >
                    <Input placeholder="VD: Công nghệ thông tin" />
                </Form.Item>
                <Form.Item
                    name="maNganh"
                    label="Mã ngành"
                    rules={[{ required: true, message: 'Vui lòng nhập mã ngành' }]}
                >
                    <Input placeholder="VD: CNTT" />
                </Form.Item>
                <Form.Item
                    name="moTa"
                    label="Mô tả"
                >
                    <Input.TextArea placeholder="Thông tin mô tả (không bắt buộc)" autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value="Active">Đang hoạt động</Select.Option>
                        <Select.Option value="Inactive">Không hoạt động</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MajorModalForm;
