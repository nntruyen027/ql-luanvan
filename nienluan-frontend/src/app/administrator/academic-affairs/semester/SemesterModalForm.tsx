'use client';

import { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { AcademicYear } from "@/types/academicYear";
import { Semester } from "@/types/semester";
import { useDispatch } from 'react-redux';
import { showNotification } from "@/store/noti/slice";
import { toast } from "react-toastify";
import { addSemester, updateSemester } from './semesterService';

type Props = {
    open: boolean;
    editingSemester: Semester | null;
    academicYears: AcademicYear[];
    onCancel: () => void;
    onOk: () => void;
};

const SemesterModalForm = ({
    open,
    editingSemester,
    academicYears,
    onCancel,
    onOk,
}: Props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (open) {
            const ngayBatDau = dayjs(editingSemester?.startDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            const ngayKetThuc = dayjs(editingSemester?.endDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            if (editingSemester) {
                form.setFieldsValue({
                    tenKyHoc: editingSemester.name,
                    namHoc: editingSemester?.year?.id,
                    ngayBatDau: ngayBatDau.isValid() ? ngayBatDau : null,
                    ngayKetThuc: ngayKetThuc.isValid() ? ngayKetThuc : null,
                    trangThai: editingSemester.status
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingSemester, open, form]);


    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                name: values.tenKyHoc,
                academic_year_id: values.namHoc,
                start_date: values.ngayBatDau.format("YYYY-MM-DD"),
                end_date: values.ngayKetThuc.format("YYYY-MM-DD"),
                is_active: values.trangThai === "Active",
            };

            if (!editingSemester) {
                const response = await addSemester(payload);
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
                const response = await updateSemester(editingSemester.id, payload);
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
            title={editingSemester ? 'Chỉnh sửa kỳ học' : 'Thêm kỳ học'}
            confirmLoading={loading}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleSubmit}
            okText={editingSemester ? 'Cập nhật' : 'Thêm mới'}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenKyHoc"
                    label="Tên kỳ học"
                    rules={[{ required: true, message: 'Vui lòng nhập tên kỳ học' }]}
                >
                    <Input placeholder="VD: Kỳ 1 - 2024" />
                </Form.Item>

                <Form.Item
                    name="namHoc"
                    label="Năm học"
                    rules={[{ required: true, message: 'Vui lòng chọn năm học' }]}
                >
                    <Select placeholder="Chọn năm học">
                        {academicYears.map((year) => (
                            <Select.Option key={year.id} value={year.id}>
                                {year.name}
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

export default SemesterModalForm;
