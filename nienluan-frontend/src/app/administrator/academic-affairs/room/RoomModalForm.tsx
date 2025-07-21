'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { Room } from '@/types/room';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { addRoom, updateRoom } from './roomService';

type Props = {
    open: boolean;
    editingRoom: Room | null;
    onCancel: () => void;
    onOk: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    paginationState: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    };
};

const RoomModalForm = ({
    open,
    editingRoom,
    onCancel,
    onOk,
    paginationState
}: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingRoom) {
                form.setFieldsValue({
                    tenPhong: editingRoom.name,
                    moTa: editingRoom.description,
                    trangThai: editingRoom.status
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingRoom, open, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                name: values.tenPhong,
                description: values.moTa,
                is_active: values.trangThai === "Active",
            };

            if (!editingRoom) {
                const response = await addRoom(payload);
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
                const response = await updateRoom(editingRoom.id, payload);
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
            onOk(paginationState);
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
            title={editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingRoom ? 'Cập nhật' : 'Thêm mới'}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenPhong"
                    label="Tên phòng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
                >
                    <Input placeholder="VD: Phòng họp" />
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

export default RoomModalForm;
