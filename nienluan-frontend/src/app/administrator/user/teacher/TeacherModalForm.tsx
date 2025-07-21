'use client';

import { Form, Input, Modal, Select } from 'antd';
import { Teacher } from "@/types/user";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { addTeacher, updateTeacher } from './teacherService';
import { Major } from '@/types/major';
import { PermissionGroup } from '@/types/permission';

type Props = {
    open: boolean;
    editingTeacher: Teacher | null;
    onCancel: () => void;
    onOk: () => void;
    filterMajor: Major[]
    roles: PermissionGroup[]
};

const TeacherModalForm = ({ open, editingTeacher, onCancel, onOk, filterMajor, roles }: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingTeacher) {
                form.setFieldsValue({
                    userCode: editingTeacher.userCode,
                    fullName: editingTeacher.name,
                    email: editingTeacher.email,
                    phoneNumber: editingTeacher.phoneNumber,
                    major: editingTeacher.major?.id,
                    role: editingTeacher.roles?.id
                });
            } else {
                form.setFieldsValue({
                    userCode: '',
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    major: undefined, // select nên để undefined
                    role: undefined    // select nên để undefined
                });
            }
        }
    }, [editingTeacher, open, form]);


    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                user_code: values.userCode,
                name: values.fullName,
                email: values.email,
                phone_number: values.phoneNumber,
                major_id: values.major,
                role_id: values.role
            };

            if (!editingTeacher) {
                const response = await addTeacher(payload);
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
                const response = await updateTeacher(editingTeacher.id, payload);
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
            title={editingTeacher ? 'Chỉnh sửa cán bộ' : 'Thêm cán bộ'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingTeacher ? 'Cập nhật' : 'Thêm mới'}
            centered
        >
            <Form form={form} layout="vertical" initialValues={editingTeacher || {}}>
                <Form.Item name="userCode" label="Mã cán bộ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                    <Input />
                </Form.Item>
                <Form.Item name="major" label="Chuyên ngành">
                    <Select
                        showSearch
                        placeholder="Chọn chuyên ngành"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                        }
                        options={filterMajor.map((m) => ({
                            label: m.name,
                            value: m.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item name="role" label="Nhóm quyền" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="Chọn nhóm quyền"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                        }
                        options={roles.map((m) => ({
                            label: m.name,
                            value: m.id,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TeacherModalForm;
