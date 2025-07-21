'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import type { Committee as CommitteeType } from '@/types/committee';
import { Teacher } from "@/types/user";
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { addCommittee, updateCommittee } from './committeeService';
import { ThesisRegister } from '@/types/thesisRegister';
import { useWatch } from 'antd/es/form/Form';

type Props = {
    open: boolean;
    editingCommittee: CommitteeType | null;
    teachers: Teacher[];
    onCancel: () => void;
    onOk: () => void;
    thesis: ThesisRegister[]
};

const CommitteeModalForm = ({
    open,
    editingCommittee,
    teachers,
    onCancel,
    onOk,
    thesis
}: Props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<ThesisRegister>();


    useEffect(() => {
        if (selectedThesis) {
            const filterThesis = thesis.find(p => p.thesis.id === selectedThesis);
            setSelectedProject(filterThesis);
        }
    }, [selectedThesis, thesis]);

    useEffect(() => {
        if (open) {
            if (editingCommittee) {
                const thesisId = editingCommittee.thesis.id;

                form.setFieldsValue({
                    deTai: thesisId,
                    committee: editingCommittee.members.map(member => ({
                        teacherId: member.user.id,
                        role: member.position,
                    }))
                });

                if (thesisId) {

                    const filterThesis = thesis.find(p => p.thesis.id === thesisId);
                    setSelectedProject(filterThesis);
                }
            } else {
                form.resetFields();
            }
        }
    }, [editingCommittee, open, form, thesis]);




    const handleSubmit = async () => {

        try {
            setLoading(true);
            const values = await form.validateFields();

            const payload = {
                thesis_id: values.deTai, // ID luận văn đã chọn
                members: values.committee.map((item: any) => ({
                    user_id: item.teacherId,
                    position: item.role
                }))
            };

            if (!editingCommittee) {

                const response = await addCommittee(payload);
                const responseData = { message: response.data.message, type: response.data.status };
                if (responseData.type === 'success') {
                    dispatch(showNotification(responseData));
                    toast.success(responseData.message, {
                        position: "top-right"
                    });
                } else {
                    dispatch(showNotification(responseData));
                    toast.error(responseData.message, {
                        position: "top-right"
                    });
                }
            }
            else {
                const response = await updateCommittee(editingCommittee.id, payload);
                const responseData = { message: response.data.message, type: response.data.status };
                if (responseData.type === 'success') {
                    dispatch(showNotification(responseData));
                    toast.success(responseData.message, {
                        position: "top-right"
                    });
                } else {
                    dispatch(showNotification(responseData));
                    toast.error(responseData.message, {
                        position: "top-right"
                    });
                }
            }

            form.resetFields();
            setSelectedProject(undefined);
            onOk();
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).forEach((fieldErrors: any) => {
                    fieldErrors.forEach((msg: string) => {
                        toast.error(msg, {
                            position: "top-right"
                        });
                    });
                });
            } else {
                const responseData = { message: error.response?.data?.message, type: error.response?.data?.status };
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const watchedCommittee = useWatch('committee', form);

    const selectedTeacherIds = useMemo(() => {
        return (watchedCommittee || [])
            .map((item: any) => item?.teacherId)
            .filter(Boolean);
    }, [watchedCommittee]);

    const handleCancel = () => {
        form.resetFields();
        setSelectedProject(undefined);
        onCancel();
    }

    return (
        <Modal
            open={open}
            title={editingCommittee ? 'Chỉnh sửa hội đồng luận văn' : 'Thêm hội đồng luận văn'}
            onCancel={handleCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText={editingCommittee ? 'Cập nhật' : 'Thêm mới'}
            centered
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="deTai"
                    label="Luận văn"
                    rules={[{ required: true, message: 'Vui lòng chọn luận văn' }]}
                >
                    <Select
                        placeholder="Chọn đề tài"
                        value={selectedThesis}
                        onChange={setSelectedThesis}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                    >
                        {thesis.map(project => (
                            <Select.Option key={project.thesis.id} value={project.thesis.id}>
                                {project.thesis.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {selectedProject && (
                    <div className="bg-gray-50 border rounded p-2 mb-4 text-sm">
                        <p><strong>Sinh viên:</strong> {selectedProject.students?.map(s => s.name).join(', ')}</p>
                        <p><strong>GV hướng dẫn:</strong> {selectedProject.thesis.lecturer.name}</p>
                        <p><strong>Kỳ báo cáo:</strong> {selectedProject.thesis.report_period.name}</p>
                        <p><strong>Học kỳ:</strong> {selectedProject.thesis.report_period.semester.name}</p>
                        <p><strong>Năm:</strong> {selectedProject.thesis.report_period.semester.academic_year.name}</p>
                    </div>
                )}

                <Form.List
                    name="committee"
                    rules={[{
                        validator: async (_, value) => {
                            if (!value || value.length < 3) {
                                return Promise.reject(new Error('Cần ít nhất 3 giảng viên'));
                            }
                        }
                    }]}
                >
                    {(fields, { add, remove }, meta) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => {
                                const currentValue = form.getFieldValue(['committee', name, 'teacherId']);
                                const filteredTeachers = teachers.filter(t => !selectedTeacherIds.includes(t.id) || t.id === currentValue);
                                return (
                                    <div key={key} className="flex gap-2">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'teacherId']}
                                            rules={[{ required: true, message: 'Chọn giảng viên' }]}
                                            className="flex-1"
                                        >
                                            <Select placeholder="Giảng viên">
                                                {filteredTeachers.map(t => (
                                                    <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'role']}
                                            rules={[{ required: true, message: 'Chức vụ' }]}
                                            className="flex-1"
                                        >
                                            <Select placeholder="Chức vụ">
                                                <Select.Option value="Chủ tịch">Chủ tịch</Select.Option>
                                                <Select.Option value="Thư ký">Thư ký</Select.Option>
                                                <Select.Option value="Ủy viên">Ủy viên</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Button danger onClick={() => remove(name)}>X</Button>
                                    </div>
                                );
                            })}

                            {meta.errors.length > 0 && (
                                <p className="text-red-500 text-sm">
                                    {meta.errors[0]}
                                </p>
                            )}


                            <Form.Item>
                                <Button onClick={() => add()} className="text-blue-500">
                                    + Thêm giảng viên
                                </Button>
                            </Form.Item>


                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default CommitteeModalForm;