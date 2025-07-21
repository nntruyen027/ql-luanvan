'use client';

import { Form, Input, Modal, Select } from 'antd';
import { Permission } from "@/types/permission";
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { addPermission, updatePermission } from './permissionService';

type Props = {
    open: boolean;
    editingPermission: Permission | null;
    onCancel: () => void;
    onOk: () => void;
};

const modules = [
    { id: 1, name: 'Danh sách cán bộ' },
    { id: 2, name: 'Danh sách sinh viên' },
    { id: 3, name: 'Danh sách quyền' },
    { id: 4, name: 'Danh sách nhóm quyền' },
    { id: 5, name: 'Danh sách năm học' },
    { id: 6, name: 'Danh sách kỳ học' },
    { id: 7, name: 'Danh sách ngành học' },
    { id: 8, name: 'Danh sách phòng học' },
    { id: 9, name: 'Danh sách đợt đăng ký' },
    { id: 10, name: 'Danh sách đề tài đăng ký' },
    { id: 11, name: 'Danh sách hội đồng luận văn' },
    { id: 12, name: 'Danh sách lịch bảo vệ' },
    { id: 13, name: 'Đề tài đăng ký' },
    { id: 14, name: 'Đề tài công bố' },
    { id: 15, name: 'Công việc luận văn' },
    { id: 16, name: 'Lịch bảo vệ' },
];

const actions = [
    { id: 1, name: 'Truy cập' },
    { id: 2, name: 'Thêm' },
    { id: 3, name: 'Sửa' },
    { id: 4, name: 'Xóa' },
];

const PermissionModalForm = ({ open, editingPermission, onCancel, onOk }: Props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (open) {
            if (editingPermission) {
                form.setFieldsValue({
                    module: editingPermission.module,
                    action: editingPermission.action,
                    code: editingPermission.code
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingPermission, open, form]);


    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                module: values.module,
                action: values.action,
                code: values.code
            };

            if (!editingPermission) {
                const response = await addPermission(payload);
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
                const response = await updatePermission(editingPermission.id, payload);
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
            title={editingPermission ? 'Chỉnh sửa quyền' : 'Thêm quyền'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingPermission ? 'Cập nhật' : 'Thêm mới'}
        >
            <Form form={form} layout="vertical" initialValues={editingPermission || {}}>
                <Form.Item
                    name="module"
                    label="Module"
                    rules={[{ required: true, message: 'Vui lòng chọn module' }]}
                >
                    <Select placeholder="Chọn module">
                        {modules.map((module) => (
                            <Select.Option key={module.id} value={module.name}>
                                {module.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="action"
                    label="Hành động"
                    rules={[{ required: true, message: 'Vui lòng chọn hành động' }]}
                >
                    <Select placeholder="Chọn hành động">
                        {actions.map((action) => (
                            <Select.Option key={action.id} value={action.name}>
                                {action.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="code"
                    label="Mã quyền"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã quyền' },
                        {
                            pattern: /^[a-z]+:[a-z\-]+$/, // ← Cho phép gạch ngang sau dấu :
                            message: 'Định dạng không hợp lệ. Ví dụ đúng: access:academic-affairs'
                        }
                    ]}
                >
                    <Input placeholder="Ví dụ: access:academic-affairs" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PermissionModalForm;
