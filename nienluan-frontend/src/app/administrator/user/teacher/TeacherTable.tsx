'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { PageData } from '@/components/Table';
import Table from '@/components/Table';
import { Key } from 'react';
import { Teacher } from "@/types/user";
import { usePermission } from '@/lib/auth';

type Props = {
    data: PageData<Teacher>;
    onEdit: (student: Teacher) => void;
    onSelectionChange: (keys: Key[]) => void;
    onTableChange?: (params: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    loading: boolean,
    confirmDelete: (id: number) => void;
    confirmCreateAccount: (id: number) => void;
    confirmReset: (id: number) => void;
    currentPage: number;
    pageSize: number;
};

const TeacherTable = ({ data, onEdit, onSelectionChange, onTableChange, loading, confirmDelete, confirmCreateAccount, confirmReset, currentPage, pageSize }: Props) => {
    const { hasPermission } = usePermission();

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        { title: 'Mã cán bộ', dataIndex: 'userCode' },
        { title: 'Họ và tên', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber' },
        { title: 'Chuyên ngành', dataIndex: ['major', 'name'] },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            rowKey="id"
            loading={loading}
            onChange={onTableChange}
            actions={(record) => {
                const menuItems = [
                    {
                        key: 'account',
                        icon: record.userName !== null ? <RedoOutlined /> : <PlusOutlined />,
                        label: record.userName !== null ? 'Reset mật khẩu' : 'Tài khoản',
                        permission: 'edit:faculty-staff',
                    },
                    {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Sửa',
                        permission: 'edit:faculty-staff',
                    },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: 'red' }} />,
                        label: <span style={{ color: 'red' }}>Xóa</span>,
                        permission: 'delete:faculty-staff',
                    },
                ];

                // Lọc các item chỉ giữ lại những cái user có quyền
                const filteredItems = menuItems.filter(item => hasPermission(item.permission));

                // Nếu không còn item nào thì có thể ẩn luôn dropdown (trả về null)
                if (filteredItems.length === 0) return null;

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: filteredItems,
                            onClick: ({ key }) => {
                                if (key === 'account') {
                                    if (record.userName !== null) {
                                        confirmReset(record.id);
                                    } else {
                                        confirmCreateAccount(record.id);
                                    }
                                }
                                if (key === 'edit') onEdit(record);
                                if (key === 'delete') confirmDelete(record.id);
                            },
                        }}
                    >
                        <MoreOutlined className="rotate-90" />
                    </Dropdown>
                );
            }}
            onSelectionChange={onSelectionChange}
        />
    );
};

export default TeacherTable;
