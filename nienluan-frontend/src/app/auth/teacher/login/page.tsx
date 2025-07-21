'use client';

import { Button, Col, Flex, Form, FormProps, Image, Input, Row, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/noti/slice";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    type FieldType = {
        username?: string;
        password?: string;
    };

    const router = useRouter();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            const response = await login(values.username, values.password);
            const responseData = { message: response.data.message, type: response.data.status };
            if (responseData.type === 'success') {
                dispatch(showNotification(responseData));
                toast.success(responseData.message, {
                    position: "top-right"
                });
                //Redirect sau khi login thành công
                router.push('/teacher/project/register');
            }
            else {
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }
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
        <Row>
            <Col span={12}>
                <Image src="https://thsp.ctu.edu.vn/images/upload/MssDiem/atl1.jpg" alt={'image'}
                    style={{ height: '99vh' }}
                    preview={false} />
            </Col>
            <Col span={12}>
                <Flex gap={'middle'} vertical justify={'center'} align={'center'} className={'h-[100vh]'}>
                    <Image src={'https://yu.ctu.edu.vn/images/upload/article/2020/03/0305-logo-ctu.png'} alt="logo"
                        preview={false} width={100} />
                    <Typography.Title level={2}>Hệ thống quản lý đề tài luận văn</Typography.Title>
                    <Typography.Title style={{ marginTop: 0 }} level={4}>Hệ thống quản lý đề tài luận
                        văn</Typography.Title>
                    <Form
                        size={'large'}
                        style={{ maxWidth: 360 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        className={'w-full'}

                    >
                        <Form.Item<FieldType>
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập mã số cán bộ!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Mã số cán bộ" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="Mật khẩu" />
                        </Form.Item>


                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Col>
        </Row>
    );
}
