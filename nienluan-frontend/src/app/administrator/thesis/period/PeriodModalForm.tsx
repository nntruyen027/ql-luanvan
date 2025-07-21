'use client';

import { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { ThesisReportPeriod } from "@/types/thesisReportPeriod";
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { addReportPeriod, getSemesterOptions, updateReportPeriod } from './periodService';

type Props = {
    open: boolean;
    editingPeriod: ThesisReportPeriod | null;
    onCancel: () => void;
    onOk: () => void;
};

type SemesterOption = {
    value: number;
    label: string;
};


const ThesisReportPeriodModalForm = ({
    open,
    editingPeriod,
    onCancel,
    onOk,
}: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [semesterOptions, setSemesterOptions] = useState<SemesterOption[]>([]);


    const loadSemesterOptions = async () => {
        const response = await getSemesterOptions();
        setSemesterOptions(response.data);
    }

    useEffect(() => {
        if (open) {
            loadSemesterOptions();
            const ngayBatDau = dayjs(editingPeriod?.startDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            const ngayKetThuc = dayjs(editingPeriod?.endDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            if (editingPeriod) {
                form.setFieldsValue({
                    tenKy: editingPeriod.name,
                    hocKy: editingPeriod?.semester?.id,
                    ngayBatDau: ngayBatDau.isValid() ? ngayBatDau : null,
                    ngayKetThuc: ngayKetThuc.isValid() ? ngayKetThuc : null,
                    trangThai: editingPeriod.status
                });
            } else {
                form.resetFields();
            }
        }
    }, [editingPeriod, open, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const payload = {
                name: values.tenKy,
                semester_id: values.hocKy,
                start_date: values.ngayBatDau.format("YYYY-MM-DD"),
                end_date: values.ngayKetThuc.format("YYYY-MM-DD"),
                is_active: values.trangThai === "Active",
            };

            if (!editingPeriod) {
                const response = await addReportPeriod(payload);
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
                const response = await updateReportPeriod(editingPeriod.id, payload);
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
            title={editingPeriod ? 'Chỉnh sửa kỳ báo cáo' : 'Thêm kỳ báo cáo'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText={editingPeriod ? 'Cập nhật' : 'Thêm mới'}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="tenKy"
                    label="Tên kỳ báo cáo"
                    rules={[{ required: true, message: 'Vui lòng nhập tên kỳ báo cáo' }]}
                >
                    <Input placeholder="VD: Đợt 1 - 2025" />
                </Form.Item>

                <Form.Item
                    name="hocKy"
                    label="Thuộc học kỳ"
                    rules={[{ required: true, message: 'Vui lòng chọn học kỳ' }]}
                >
                    <Select placeholder="Chọn học kỳ">
                        {semesterOptions.map((s) => (
                            <Select.Option key={s.value} value={s.value}>
                                {s.label}
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

export default ThesisReportPeriodModalForm;
