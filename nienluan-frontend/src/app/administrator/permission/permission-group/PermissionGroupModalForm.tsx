'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { Permission, PermissionGroup } from "@/types/permission";
import { addRole, roleByModule, updateRole } from './permissionGroupService';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';


type Props = {
    open: boolean;
    editingPermissionGroup: PermissionGroup | null;
    onCancel: () => void;
    onOk: () => void;
};


const PermissionGroupModalForm = ({
    open,
    editingPermissionGroup,
    onCancel,
    onOk
}: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadRoleByModule();
            if (editingPermissionGroup) {
                form.setFieldsValue({
                    name: editingPermissionGroup.name,
                    permissions: editingPermissionGroup.permissions.map(permission => permission.id)
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingPermissionGroup, open, form]);

    const loadRoleByModule = async () => {
        const response = await roleByModule();
        setPermissions(response.data);
    };


    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                name: values.name,
                permissions: values.permissions?.map((item: any) => ({
                    permission_id: item
                }))
            };

            if (!editingPermissionGroup) {
                const response = await addRole(payload);
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
                const response = await updateRole(editingPermissionGroup.id, payload);
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
            title={editingPermissionGroup ? 'Chỉnh sửa nhóm quyền' : 'Thêm nhóm quyền'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingPermissionGroup ? 'Cập nhật' : 'Thêm mới'}
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Tên nhóm quyền" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="permissions"
                    label="Danh sách quyền"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn các quyền"
                        showSearch
                        optionFilterProp="data-code"
                        filterOption={(input, option) =>
                            (option?.props['data-code'] as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {permissions.map((p) => (
                            <Select.Option
                                key={p.id}
                                value={p.id}
                                data-code={p.code}
                            >
                                {`${p.code} (${p.action}:${p.module})`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PermissionGroupModalForm;
