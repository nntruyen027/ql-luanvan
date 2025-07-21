'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Image, Layout, Menu, Typography } from 'antd';
import { BookOutlined, EditOutlined, LockOutlined, LogoutOutlined, UsergroupAddOutlined, UserOutlined, } from '@ant-design/icons';
import { getCurrentUser, logout, usePermission } from '@/lib/auth';
import { MenuItem } from '@/types/MenuItem';
import { ItemType } from 'antd/es/menu/interface';
import { Major } from '@/types/major';
import { getMajorListOptions } from '../administrator/user/teacher/teacherService';
import UpdateUserModal from '@/components/modal/userProfile';
import ChangePasswordModal from '@/components/modal/changePasswordModal';

const { Header, Sider, Content } = Layout;



const rawMenuItems: MenuItem[] = [
    {
        key: 'project-management',
        icon: <UsergroupAddOutlined />,
        label: 'Chuẩn bị đề tài',
        children: [
            {
                key: 'project-register',
                label: <Link href="/teacher/project/register">Đề tài đăng ký</Link>,
                permission: 'access:thesis-register',
            },
            {
                key: 'publish-project',
                label: <Link href="/teacher/project/publish">Đề tài công bố</Link>,
                permission: 'access:thesis-publish',
            },
        ],
    },
    {
        key: 'pending-project',
        icon: <BookOutlined />,
        label: 'Thực hiện đề tài',
        children: [
            {
                key: 'project',
                label: <Link href="/teacher/thesis/project">Công việc luận văn</Link>,
                permission: 'access:thesis-task',
            },
            {
                key: 'schedule',
                label: <Link href="/teacher/thesis/schedule">Lịch bảo vệ</Link>,
                permission: 'access:thesis-schedule',
            }
        ],
    },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string>('Đề tài đăng ký');
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    const userName = user?.name || 'Người dùng';
    const avatarSrc = user?.avatar || null;
    const router = useRouter();
    const [filterMajor, setFilterMajor] = useState<Major[]>([]);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { hasPermission } = usePermission();


    function filterMenuByPermission(items: MenuItem[] = []): MenuItem[] {
        return items.reduce<MenuItem[]>((acc, item) => {
            const filteredChildren = item.children
                ? filterMenuByPermission(item.children)
                : undefined;

            const hasItemPermission =
                item.permission ? hasPermission(item.permission) : false;

            const shouldInclude =
                hasItemPermission || (filteredChildren && filteredChildren.length > 0);

            // Nếu item không có permission & không có con nào được phép => ẩn luôn
            if (!shouldInclude) {
                return acc; // bỏ qua item này
            }

            acc.push({
                ...item,
                children: filteredChildren,
            });

            return acc;
        }, []);
    }




    const handleClick: MenuProps['onClick'] = ({ key }) => {
        const findLabel = (items: MenuItem[] | undefined, keyToFind: string): string | null => {
            for (const item of items || []) {
                if (!item) continue;
                if (item.key === key) {
                    if ("label" in item) {
                        const label = item?.label;
                        if (typeof label === 'string') return label;
                        if (React.isValidElement(label)) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            return (label.props?.children || '') as string;
                        }
                    }

                }
                if ('children' in item && Array.isArray(item.children)) {
                    const found = findLabel(item.children, keyToFind);
                    if (found) return found;
                }
            }
            return null;
        };

        const label = findLabel(rawMenuItems, key);
        if (label) setSelectedMenu(label);
    };

    // Menu người dùng
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Đổi thông tin',
            icon: <EditOutlined />,
        },
        {
            key: 'change-password',
            label: 'Đổi mật khẩu',
            icon: <LockOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const onUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
        switch (key) {
            case 'profile':
                setVisible(true);
                break;
            case 'change-password':
                setModalVisible(true);
                break;
            case 'logout':
                await logout();
                router.push('/auth/teacher/login');
                break;
        }
    };

    const loadMajorData = async () => {
        const response = await getMajorListOptions();
        setFilterMajor(response.data.filter(x => x.is_active == true));
    };

    useEffect(() => {
        loadMajorData();
    }, [])

    const handleModalOk = async () => {
        await getCurrentUser();
        setVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="light"
                width={260}
                style={{ paddingTop: 20, overflow: 'hidden' }}
            >
                <div
                    className="demo-logo-vertical flex justify-center items-center gap-2"
                    style={{ marginBottom: 24 }}
                >
                    <Image
                        src="https://yu.ctu.edu.vn/images/upload/article/2020/03/0305-logo-ctu.png"
                        alt="logo"
                        preview={false}
                        width={collapsed ? 32 : 50}
                    />
                    {!collapsed && (
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Quản lý luận văn
                        </Typography.Title>
                    )}
                </div>
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={['project-register']}
                        onClick={handleClick}
                        items={filterMenuByPermission(rawMenuItems) as ItemType[]}
                    />
                </div>
            </Sider>

            <Layout>
                <Header
                    className="flex rounded-md justify-between items-center px-6"
                    style={{ margin: '24px 16px 0', padding: '0 1rem', background: '#fff' }}
                >
                    <Typography.Title style={{ margin: 0 }} level={3}>
                        {selectedMenu}
                    </Typography.Title>

                    <Dropdown menu={{ items: userMenuItems, onClick: onUserMenuClick }} trigger={['click']}>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar
                                size="large"
                                src={avatarSrc ? `http://localhost:8000${avatarSrc}` : null}
                                icon={!avatarSrc && <UserOutlined />}
                            />
                            <span className="font-medium">{userName}</span>
                        </div>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'auto' }}>
                    <div style={{ minHeight: '100%' }}>{children}</div>
                </Content>
            </Layout>

            <UpdateUserModal
                visible={visible}
                onClose={() => setVisible(false)}
                onOk={handleModalOk}
                initialData={{ id: user.id, userCode: user.user_code, name: user.name, email: user.email, phoneNumber: user.phone_number, major: user.major_id, avatar: user.avatar }}
                filterMajor={filterMajor}
            />

            <ChangePasswordModal
                visible={modalVisible}
                userId={user?.id}
                onClose={() => setModalVisible(false)}
            />
        </Layout>
    );
}
