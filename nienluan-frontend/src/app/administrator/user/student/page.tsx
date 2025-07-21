'use client';

import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import StudentTable from './StudentTable';
import StudentModalForm from './StudentModalForm';
import { Student } from "@/types/user";
import { useDispatch } from 'react-redux';
import { PageData } from '@/components/Table';
import { createStudentAccount, deleteMultiStudent, deleteStudent, filterStudent, getStudentList, resetStudentAccount } from './studentService';
import { Major } from '@/types/major';
import { getMajorListOptions, getRolesListOption } from '../teacher/teacherService';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { PermissionGroup } from '@/types/permission';
import { usePermission } from '@/lib/auth';


const Page = () => {
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState<PageData<Student>>({
        content: [],
        totalElements: 0,
        page: 1,
        size: 10,
    });
    const [paginationState, setPaginationState] = useState<{
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }>({
        page: 1,
        size: 10,
    });
    const [searchValue, setSearchValue] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedMajor, setSelectedMajor] = useState<number | null>();
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDeleteMulti] = useState(false);
    const [loadingDeleteMulti, setLoadingDelete] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [major, setMajor] = useState<Major[]>([]);
    const [roles, setRoles] = useState<PermissionGroup[]>([]);
    const [filterMajor, setFilterMajor] = useState<Major[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
    const [isConfirmOpenCreate, setIsConfirmOpenCreate] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const confirmCreateAccount = (id: number) => {
        setUserId(id);
        setIsConfirmOpenCreate(true);
    };

    const confirmDelete = (id: number) => {
        setUserId(id);
        setIsConfirmOpen(true);
    };

    const confirmReset = (id: number) => {
        setUserId(id);
        setIsConfirmResetOpen(true);
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setOpenModal(true);
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setOpenModal(true);
    };

    const handleConfirmDelete = async () => {
        if (userId !== null) {
            await handleDelete(userId);
            setIsConfirmOpen(false);
            setUserId(null);
        }
    };

    const handleConfirmReset = async () => {
        if (userId !== null) {
            await handleResetAccount(userId);
            setIsConfirmResetOpen(false);
            setUserId(null);
        }
    };

    const handleConfirmCreateAccount = async () => {
        if (userId !== null) {
            await handleCreateAccount(userId);
            setIsConfirmOpenCreate(false);
            setUserId(null);
        }
    };

    const handleResetAccount = async (id: number) => {
        try {
            setLoadingReset(true);
            const response = await resetStudentAccount(id);

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
            setLoadingReset(false);
            loadData({
                page: paginationState.page,
                pageSize: paginationState.size,
                sort_by: paginationState.sortField,
                sort_order: paginationState.sortOrder,
                search: searchValue,
                major: selectedMajor
            });

        } catch (error: any) {
            setLoadingReset(false);
            const msg = error?.response?.data?.message || 'Thêm tài khoản thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    };

    const handleCreateAccount = async (id: number) => {
        try {
            setLoadingCreate(true);

            const values = await form.validateFields();

            const formData = new FormData();

            formData.append('username', values.tenTaiKhoan);
            formData.append('password', values.matKhau);
            const response = await createStudentAccount(id, formData);

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
            setLoadingCreate(false);
            loadData({
                page: paginationState.page,
                pageSize: paginationState.size,
                sort_by: paginationState.sortField,
                sort_order: paginationState.sortOrder,
                search: searchValue,
                major: selectedMajor
            });

        } catch (error: any) {
            setLoadingCreate(false);
            const msg = error?.response?.data?.message || 'Thêm tài khoản thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoadingDelete(true);
            const response = await deleteStudent(id);

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
            setLoadingDelete(false);
            loadData({
                page: paginationState.page,
                pageSize: paginationState.size,
                sort_by: paginationState.sortField,
                sort_order: paginationState.sortOrder,
                search: searchValue,
                major: selectedMajor
            });

        } catch (error: any) {
            setLoadingDelete(false);
            const msg = error?.response?.data?.message || 'Xoá thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    };

    const handleMultiDelete = async () => {
        try {
            setLoadingDeleteMulti(true);
            const response = await deleteMultiStudent(selectedIds);

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
            setSelectedIds([]);
            setLoadingDeleteMulti(false);

            loadData({
                page: paginationState.page,
                pageSize: paginationState.size,
                sort_by: paginationState.sortField,
                sort_order: paginationState.sortOrder,
                search: searchValue,
                major: selectedMajor
            });

        } catch (error: any) {
            setLoadingDeleteMulti(false);
            const msg = error?.response?.data?.message || 'Xoá thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    };

    const handleModalOk = () => {
        loadData({
            page: paginationState.page,
            pageSize: paginationState.size,
            sort_by: paginationState.sortField,
            sort_order: paginationState.sortOrder,
            search: searchValue,
            major: selectedMajor
        });
        setOpenModal(false);
    };

    const loadData = async ({
        page = 1,
        pageSize = 10,
        sort_by,
        sort_order,
        search,
        major
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
        major?: number | null
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getStudentList({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            major
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getStudentList({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                major
            });
        }

        setData(response);
        setLoading(false);
    };

    const loadMajorData = async () => {
        const response = await getMajorListOptions();
        setMajor(response.data);
        setFilterMajor(response.data.filter(x => x.is_active == true));
    };

    const loadRolesData = async () => {
        const response = await getRolesListOption();
        const forbidden = ['admin', 'super_admin', 'Admin', 'Super_admin'];
        setRoles(response.data.filter(x => !forbidden.includes(x.name)));
    };

    useEffect(() => {
        loadData();
        loadMajorData();
        loadRolesData();
    }, []);

    const searchStudent = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const major = selectedMajor;
            const response = await filterStudent({ page, per_page: 10, search, major });
            setData(response);
            setPaginationState(prev => ({
                ...prev,
                page: 1,
            }));
            setLoadingSearch(false);

        } catch (error: any) {
            setLoadingSearch(false);
            const msg = error?.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    }

    const handleTableChange = ({
        page,
        size,
        sortField,
        sortOrder,
    }: {
        page: number;
        size: number;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        setPaginationState({ page, size, sortField, sortOrder });
        loadData({
            page,
            pageSize: size,
            sort_by: sortField,
            sort_order: sortOrder,
            search: searchValue,
            major: selectedMajor
        });
    };

    if (!hasPermission('access:students')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:students') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} sinh viên?`}
                            onConfirm={handleMultiDelete}
                            okButtonProps={{ loading: loadingDeleteMulti }}
                            okText="Xoá"
                            cancelText="Huỷ"
                            disabled={!selectedIds.length}
                        >
                            <Button danger disabled={!selectedIds.length} icon={<DeleteOutlined />}>
                                Xoá hàng loạt
                            </Button>
                        </Popconfirm>
                    )}

                    {hasPermission('add:students') && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm sinh viên
                        </Button>
                    )}
                </Space>
            </div>

            <div className="bg-white p-4 rounded-md">
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Select
                        placeholder="Ngành học"
                        value={selectedMajor}
                        onChange={setSelectedMajor}
                        style={{ flex: 1, minWidth: 200 }}
                        showSearch
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                        }
                        options={major.map((m) => ({
                            label: m.name,
                            value: m.id,
                        }))}
                    />
                    <Input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />} />
                    <Button onClick={() => {
                        setSelectedMajor(null);
                        setSearchValue('');
                    }} icon={<CloseOutlined />} />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={searchStudent}>
                        Tìm kiếm
                    </Button>
                </Space>

                <StudentTable
                    data={data}
                    loading={loading}
                    onEdit={handleEdit}
                    confirmDelete={confirmDelete}
                    confirmReset={confirmReset}
                    confirmCreateAccount={confirmCreateAccount}
                    onSelectionChange={setSelectedIds}
                    onTableChange={handleTableChange}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />
            </div>

            <StudentModalForm
                open={openModal}
                editingStudent={editingStudent}
                onCancel={() => setOpenModal(false)}
                onOk={handleModalOk}
                filterMajor={filterMajor}
                roles={roles}
            />

            <Modal
                title="Xác nhận xoá"
                open={isConfirmOpen}
                onOk={handleConfirmDelete}
                confirmLoading={loadingDelete}
                onCancel={() => setIsConfirmOpen(false)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xoá sinh viên này không?</p>
            </Modal>

            <Modal
                title="Xác nhận đặt lại mật khẩu"
                open={isConfirmResetOpen}
                onOk={handleConfirmReset}
                confirmLoading={loadingReset}
                onCancel={() => setIsConfirmResetOpen(false)}
                okText="Đặt lại"
                cancelText="Huỷ"
            >
                <p>Bạn có chắc chắn muốn đặt lại mật khẩu tài khoản của sinh viên này không?</p>
            </Modal>


            <Modal
                title="Tạo tài khoản"
                open={isConfirmOpenCreate}
                onOk={handleConfirmCreateAccount}
                confirmLoading={loadingCreate}
                onCancel={() => setIsConfirmOpenCreate(false)}
                okText="Tạo"
                cancelText="Huỷ"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirmDelete} // xử lý submit khi bấm OK
                >
                    <Form.Item
                        name="tenTaiKhoan"
                        label="Tên tài khoản"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                    >
                        <Input placeholder="Nhập tên tài khoản" />
                    </Form.Item>

                    <Form.Item
                        name="matKhau"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                                message:
                                    'Mật khẩu phải có ít nhất 6 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
