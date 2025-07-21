'use client';

import { Form, Input, Modal, Select } from 'antd';
import { Student } from "@/types/user";
import { Major } from '@/types/major';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { addStudent, updateStudent } from './studentService';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { PermissionGroup } from '@/types/permission';

type Props = {
    open: boolean;
    editingStudent: Student | null;
    onCancel: () => void;
    onOk: () => void;
    filterMajor: Major[];
    roles: PermissionGroup[]
};

const StudentModalForm = ({ open, editingStudent, onCancel, onOk, filterMajor, roles }: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (open) {
            if (editingStudent) {
                form.setFieldsValue({
                    userCode: editingStudent.userCode,
                    fullName: editingStudent.name,
                    email: editingStudent.email,
                    phoneNumber: editingStudent.phoneNumber,
                    major: editingStudent.major?.id,
                    role: editingStudent.roles?.id
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
    }, [editingStudent, open, form]);


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

            if (!editingStudent) {
                const response = await addStudent(payload);
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
                const response = await updateStudent(editingStudent.id, payload);
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
            title={editingStudent ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingStudent ? 'Cập nhật' : 'Thêm mới'}
            centered
        >
            <Form form={form} layout="vertical" initialValues={editingStudent || {}}>
                <Form.Item name="userCode" label="Mã sinh viên" rules={[{ required: true }]}>
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

export default StudentModalForm;
