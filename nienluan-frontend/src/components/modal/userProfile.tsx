import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button, Avatar, message, Select } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Major } from '@/types/major';
import { Teacher } from '@/types/user';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { updateUserInformation } from '@/app/administrator/user/teacher/teacherService';



type Props = {
    visible: boolean;
    onClose: () => void;
    onOk: () => void;
    initialData: Teacher;
    filterMajor: Major[]
};



const UpdateUserModal = ({ visible, onClose, onOk, initialData, filterMajor }: Props) => {
    const [form] = Form.useForm();

    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible) {
            setAvatarUrl(`http://localhost:8000${initialData?.avatar}`);

            const storedAvatar = `http://localhost:8000${initialData?.avatar}`;
            if (storedAvatar) {
                const path = initialData?.avatar;
                if (path) {
                    const avatarName = path.split('/avatar/')[1];
                    // Create a file-like object to display in the Upload component's fileList
                    const fileObj = {
                        uid: '-1',
                        name: avatarName,
                        status: 'done',
                        url: storedAvatar,
                        originFileObj: null
                    };
                    setAvatarFile([fileObj]);
                }
            }
            else {
                setAvatarFile([]);
            }
        }
    }, [visible]);


    const handleUploadChange = (info: any) => {
        // Nếu không có file (file bị xóa), reset trạng thái
        if (!info.fileList || info.fileList.length === 0) {
            setAvatarUrl(avatarUrl); // Giữ avatar cũ nếu không có file mới
            setAvatarFile([]); // Reset file
            return;
        }

        const file = info.fileList[0]?.originFileObj; // Lấy file đầu tiên
        if (!file) return;

        // Kiểm tra kiểu file
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ chấp nhận ảnh JPG/PNG!');
            return;
        }

        // Kiểm tra dung lượng file
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
            return;
        }

        // Preview ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarUrl(e.target.result as string); // Cập nhật URL của avatar
        };
        reader.readAsDataURL(file);

        // Lưu thông tin file vào fileList (mảng chứa 1 file duy nhất)
        const fileList = [{
            uid: '-1',
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            originFileObj: file,
        }];
        setAvatarFile(fileList);
    };


    const handleOk = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();

            const formData = new FormData();
            formData.append('user_code', values.userCode);
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone_number', values.phoneNumber || '');
            formData.append('major_id', values.major || '');

            // Kiểm tra nếu có avatarFile và gửi file thật sự
            if (avatarFile && (avatarFile.length > 0 && avatarFile[0]?.originFileObj !== null)) {
                formData.append('avatar', avatarFile[0]?.originFileObj); // Gửi file thực sự (originFileObj)
            }

            const response = await updateUserInformation(values.id, formData);
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

            onOk();
            // form.resetFields();
            setAvatarFile(null);
            // setAvatarUrl(null);
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

    const handleCancel = () => {
        form.resetFields();
        setAvatarFile(null);
        // setAvatarUrl(null);
        onClose();
    };

    return (
        <Modal
            title="Cập nhật thông tin người dùng"
            open={visible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText="Lưu"
            cancelText="Huỷ"
            centered
            confirmLoading={loading}
        >
            <Form layout="vertical" form={form} initialValues={initialData}>
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="userCode" label="Mã cán bộ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
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

                <Form.Item label="Ảnh đại diện">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar
                            size={64}
                            src={avatarUrl ? avatarUrl : null}
                            icon={!avatarUrl && <UserOutlined />}
                            alt="avatar"
                        />
                        <Upload
                            fileList={avatarFile}
                            showUploadList={{
                                showRemoveIcon: false
                            }}
                            beforeUpload={() => false} // Ngăn AntD upload tự động
                            onChange={handleUploadChange}
                            accept="image/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateUserModal;
