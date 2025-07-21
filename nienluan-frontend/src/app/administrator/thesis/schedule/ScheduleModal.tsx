import React, { useState } from "react";
import {
    Button, Col, Form, Input, Modal, Row, Select, Space, TimePicker
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/vi';
import { ClockCircleOutlined } from '@ant-design/icons';
import { usePermission } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

dayjs.locale('vi');

type GroupedSchedules = {
    [session: string]: any[]; // sửa từ [] → any[] vì dữ liệu s sẽ có key như: id, topicID...
};

interface ScheduleModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: {
        scheduleId?: number;
        date: string;
        start_time: string;
        end_time: string;
        room_id: number;
        thesis_id: number;
        session: Session;
    }) => void;
    onUpdate: (values: {
        scheduleId: number;
        projectId: number;
        date: string;
        start_time: string;
        end_time: string;
    }) => void;
    onDelete: (scheduleId: number) => void;
    thesis: { thesis_id: number; name: string }[];
    selectedDate: string;
    room: { id: number; name: string };
    schedules: GroupedSchedules;
    loadingAdd: boolean;
    loadingId: number;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
    open,
    onClose,
    onSubmit,
    onUpdate,
    onDelete,
    thesis,
    selectedDate,
    room,
    schedules,
    loadingAdd,
    loadingId
}) => {
    const { hasPermission } = usePermission();
    const [form] = Form.useForm();
    const [editing, setEditing] = useState<{ [key in Session]?: number | null }>({});
    const [creating, setCreating] = useState<Session | null>(null);

    const sessions: Session[] = ['Sáng', 'Chiều'];


    const groupedBySession = sessions.reduce((acc, session) => {
        acc[session] = (schedules[session] || []).filter(
            s => s.date === selectedDate && s.roomID === room.id
        );
        return acc;
    }, {} as GroupedSchedules);

    const handleFinish = (values: any) => {
        const session = values.session as Session;

        if (values.scheduleId) {
            onUpdate({
                scheduleId: values.scheduleId,
                date: selectedDate,
                start_time: dayjs(values.startTime).format('HH:mm'),
                end_time: dayjs(values.endTime).format('HH:mm'),
                projectId: values.projectId,
            });
        } else {
            onSubmit({
                scheduleId: values.scheduleId,
                date: selectedDate,
                start_time: dayjs(values.startTime).format('HH:mm'),
                end_time: dayjs(values.endTime).format('HH:mm'),
                room_id: room.id,
                thesis_id: values.projectId,
                session,
            });
        }

        form.resetFields();
        setEditing((prev) => ({ ...prev, [session]: null }));
        setCreating(null);
    };

    const renderForm = (session: Session, record?: any) => {
        // Nếu là form thêm mới → reset sạch, rồi set session
        if (!record) {
            form.setFieldsValue({
                scheduleId: null,
                projectId: undefined,
                startTime: null,
                endTime: null,
                session: session,
            });
        }

        return (
            <Form
                onFinish={handleFinish}
                form={form}
                layout="vertical"
                initialValues={record ? {
                    scheduleId: record.id,
                    projectId: record.topicID,
                    startTime: dayjs(record.startTime, 'HH:mm'),
                    endTime: dayjs(record.endTime, 'HH:mm'),
                    session: session
                } : undefined} // đừng đặt session ở đây nếu là thêm mới
            >
                <Form.Item name="scheduleId" hidden><Input /></Form.Item>
                <Form.Item name="session" hidden><Input /></Form.Item>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="projectId"
                            label="Đề tài"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Chọn đề tài" allowClear>
                                {thesis.map((t) => (
                                    <Select.Option key={t.thesis_id} value={t.thesis_id}>
                                        {t.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="startTime"
                            label="Bắt đầu"
                            rules={[{ required: true }]}
                        >
                            <TimePicker format="HH:mm"
                                disabledTime={() => {
                                    if (session === "Sáng") {
                                        return { disabledHours: () => [...Array(24).keys()].filter(h => h < 7 || h >= 12) };
                                    }
                                    if (session === "Chiều") {
                                        return { disabledHours: () => [...Array(24).keys()].filter(h => h < 13 || h >= 18) };
                                    }
                                    return {};
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                    <Col span={8}>
                        <Form.Item
                            name="endTime"
                            label="Kết thúc"
                            rules={[{ required: true }]}
                        >
                            <TimePicker format="HH:mm"
                                disabledTime={() => {
                                    if (session === "Sáng") {
                                        return { disabledHours: () => [...Array(24).keys()].filter(h => h < 7 || h >= 12) };
                                    }
                                    if (session === "Chiều") {
                                        return { disabledHours: () => [...Array(24).keys()].filter(h => h < 13 || h >= 18) };
                                    }
                                    return {};
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item className="text-right" style={{ marginTop: 12 }}>
                    <Space>
                        <Button htmlType="button" onClick={() => {
                            form.resetFields();
                            setEditing(prev => ({ ...prev, [session]: null }));
                            setCreating(null);
                        }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loadingAdd}>
                            Lưu
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        );
    };


    return (
        <Modal
            open={open}
            onCancel={() => {
                form.resetFields();
                onClose();
                setEditing({});
                setCreating(null);
            }}
            centered
            footer={null}
            title={`Lịch phòng ${room.name} - Ngày ${formatDate(selectedDate)}`}
        >
            {sessions.map((session) => (
                <div key={session} className="mb-4">
                    <div className="font-semibold mb-2">{session}</div>
                    <div className="space-y-2">
                        {(groupedBySession[session] || []).map((s) => (
                            editing[session] === s.id ? (
                                <div key={s.id}>{renderForm(session, s)}</div>
                            ) : (
                                <div key={s.id} className="border p-2 rounded bg-gray-50">
                                    <div className="font-medium text-blue-700">
                                        <ClockCircleOutlined className="text-[12px]" /> {s.time}
                                    </div>
                                    <div>{s.topic}</div>
                                    <div className="flex gap-2 mt-1">
                                        {hasPermission('edit:defense-schedule') && (
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setCreating(null); // <-- tắt form thêm
                                                    setEditing(prev => ({ ...prev, [session]: s.id })); // bật sửa

                                                    form.setFieldsValue({
                                                        scheduleId: s.id,
                                                        projectId: s.topicID,
                                                        startTime: dayjs(s.startTime, 'HH:mm'),
                                                        endTime: dayjs(s.endTime, 'HH:mm'),
                                                        session
                                                    });
                                                }}
                                            >
                                                Sửa
                                            </Button>
                                        )}

                                        {hasPermission('delete:defense-schedule') && (
                                            <Button
                                                size="small"
                                                loading={loadingId === s.id}
                                                danger
                                                onClick={() => onDelete(s.id)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}

                        {creating === session && (
                            <div>{renderForm(session)}</div>
                        )}

                        {(creating !== session) && hasPermission('add:defense-schedule') && (
                            <Button
                                size="small"
                                onClick={() => {
                                    form.resetFields();
                                    form.setFieldsValue({ session });
                                    setEditing({});
                                    setCreating(session);
                                }}
                            >
                                + Thêm dòng mới
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </Modal>
    );
};

export default ScheduleModal;
