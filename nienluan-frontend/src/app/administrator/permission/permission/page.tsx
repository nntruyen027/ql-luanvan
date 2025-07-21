'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import PermissionTable from './PermissionTable';
import PermissionModalForm from './PermissionModalForm';
import { Permission } from "@/types/permission";
import { PageData } from '@/components/Table';
import { deleteMultiPermission, deletePermission, filterPermission, getListPermission } from './permissionService';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { usePermission } from '@/lib/auth';


const Page = () => {
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const [data, setData] = useState<PageData<Permission>>({
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


    const modules = [
        { id: 1, name: 'Danh sách cán bộ' },
        { id: 2, name: 'Danh sách sinh viên' },
        { id: 3, name: 'Danh sách quyền' },
        { id: 4, name: 'Danh sách nhóm quyền' },
        { id: 5, name: 'Danh sách năm học' },
        { id: 6, name: 'Danh sách kỳ học' },
        { id: 7, name: 'Danh sách ngành học' },
        { id: 8, name: 'Danh sách phòng học' },
        { id: 9, name: 'Danh sách đợt đăng ký' },
        { id: 10, name: 'Danh sách đề tài đăng ký' },
        { id: 11, name: 'Danh sách hội đồng luận văn' },
        { id: 12, name: 'Danh sách lịch bảo vệ' },
        { id: 13, name: 'Đề tài đăng ký' },
        { id: 14, name: 'Đề tài công bố' },
        { id: 15, name: 'Công việc luận văn' },
        { id: 16, name: 'Lịch bảo vệ' },
    ];

    const actions = [
        { id: 1, name: 'Truy cập' },
        { id: 2, name: 'Thêm' },
        { id: 3, name: 'Sửa' },
        { id: 4, name: 'Xóa' },
    ];


    const [searchValue, setSearchValue] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedModule, setSelectedModule] = useState<string | null>();
    const [selectedAction, setSelectedAction] = useState<string | null>();


    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDeleteMulti, setLoadingDeleteMulti] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleAdd = () => {
        setEditingPermission(null);
        setOpenModal(true);
    };

    const handleEdit = (permission: Permission) => {
        setEditingPermission(permission);
        setOpenModal(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId !== null) {
            await handleDelete(deleteId);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoadingDelete(true);
            const response = await deletePermission(id);

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
                module: selectedModule,
                action: selectedAction,
                search: searchValue,
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
            const response = await deleteMultiPermission(selectedIds);

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
                module: selectedModule,
                action: selectedAction,
                search: searchValue,
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
            module: selectedModule,
            action: selectedAction,
            search: searchValue,
        });
        setOpenModal(false);
    };

    const loadData = async ({
        page = 1,
        pageSize = 10,
        sort_by,
        sort_order,
        module,
        action,
        search
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        module?: string | null;
        action?: string | null;
        search?: string;
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getListPermission({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            module,
            action,
            search,
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getListPermission({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                module,
                action,
                search,
            });
        }

        setData(response);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [])


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
            module: selectedModule,
            action: selectedAction,
            search: searchValue,
        });
    };

    const searchPermission = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const module = selectedModule;
            const action = selectedAction;
            const response = await filterPermission({ page, per_page: 10, module, action, search });
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

    if (!hasPermission('access:permissions')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:permissions') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} quyền?`}
                            onConfirm={handleMultiDelete}
                            okText="Xoá"
                            cancelText="Huỷ"
                            disabled={!selectedIds.length}
                            okButtonProps={{ loading: loadingDeleteMulti }}
                        >
                            <Button danger disabled={!selectedIds.length} icon={<DeleteOutlined />}>
                                Xoá hàng loạt
                            </Button>
                        </Popconfirm>
                    )}

                    {hasPermission('add:permissions') && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm quyền
                        </Button>
                    )}
                </Space>
            </div>

            <div className="bg-white p-4 rounded-md">
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Select
                        placeholder="Module"
                        value={selectedModule}
                        onChange={setSelectedModule}
                        style={{ flex: 1, minWidth: 200 }}
                    >
                        {modules.map((module) => (
                            <Select.Option key={module.id} value={module.name}>
                                {module.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Hành động"
                        value={selectedAction}
                        onChange={setSelectedAction}
                        style={{ flex: 1, minWidth: 200 }}
                    >
                        {actions.map((action) => (
                            <Select.Option key={action.id} value={action.name}>
                                {action.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />} />
                    <Button onClick={() => {
                        setSelectedAction(null)
                        setSelectedModule(null)
                        setSearchValue('')
                    }} icon={<CloseOutlined />} />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={searchPermission}>
                        Tìm kiếm
                    </Button>
                </Space>

                <PermissionTable
                    data={data}
                    onEdit={handleEdit}
                    confirmDelete={confirmDelete}
                    onTableChange={handleTableChange}
                    onSelectionChange={setSelectedIds}
                    loading={loading}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />
            </div>

            <PermissionModalForm
                open={openModal}
                editingPermission={editingPermission}
                onCancel={() => setOpenModal(false)}
                onOk={handleModalOk}
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
                <p>Bạn có chắc chắn muốn xoá quyền này không?</p>
            </Modal>
        </div>
    );
};

export default Page;
