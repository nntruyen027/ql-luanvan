'use client';

import { useEffect } from 'react';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { AcademicYear } from "@/types/academicYear";
import { addAcademicYear, updateAcademicYear } from './academicYearService';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showNotification } from "@/store/noti/slice";
import { useState } from 'react';

type Props = {
    open: boolean;
    editingAcademicYear: AcademicYear | null;
    onCancel: () => void;
    onOk: () => void;
};

const AcademicYearModalForm = ({
    open,
    editingAcademicYear,
    onCancel,
    onOk,
}: Props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (open) {
            const ngayBatDau = dayjs(editingAcademicYear?.startDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            const ngayKetThuc = dayjs(editingAcademicYear?.endDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);

            if (editingAcademicYear) {
                form.setFieldsValue({
                    tenNamHoc: editingAcademicYear.name,
                    trangThai: editingAcademicYear.status,
                    ngayBatDau: ngayBatDau.isValid() ? ngayBatDau : null,
                    ngayKetThuc: ngayKetThuc.isValid() ? ngayKetThuc : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingAcademicYear, open, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                name: values.tenNamHoc,
                start_date: values.ngayBatDau.format("YYYY-MM-DD"),
                end_date: values.ngayKetThuc.format("YYYY-MM-DD"),
                is_active: values.trangThai === "Active",
            };

            if (!editingAcademicYear) {
                const response = await addAcademicYear(payload);
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
                const response = await updateAcademicYear(editingAcademicYear.id, payload);
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
            title={editingAcademicYear ? 'Chỉnh sửa năm học' : 'Thêm năm học'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={loading}
            onOk={handleSubmit}
            okText={editingAcademicYear ? 'Cập nhật' : 'Thêm mới'}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenNamHoc"
                    label="Tên năm học"
                    rules={[{ required: true, message: 'Vui lòng nhập tên năm học' }]}
                >
                    <Input placeholder="VD: 2024-2025" />
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

export default AcademicYearModalForm;
