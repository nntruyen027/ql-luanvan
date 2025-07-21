'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MajorTable from './MajorTable';
import MajorModalForm from './MajorModalForm';
import { Major } from "@/types/major";
import { PageData } from '@/components/Table';
import { deleteMajor, deleteMultiMajor, getMajorList, searchMajor } from './majorService';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { usePermission } from '@/lib/auth';

const Page = () => {

    const { hasPermission } = usePermission();
    const dispatch = useDispatch();

    const [data, setData] = useState<PageData<Major>>({
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
    const [editingMajor, setEditingMajor] = useState<Major | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDeleteMulti, setLoadingDeleteMulti] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleAdd = () => {
        setEditingMajor(null);
        setOpenModal(true);
    };

    const handleEdit = (major: Major) => {
        setEditingMajor(major);
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
            const response = await deleteMajor(id);

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
            const response = await deleteMultiMajor(selectedIds);

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
        });
        setOpenModal(false);
    };

    const HandleSearchMajor = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const response = await searchMajor({ page, per_page: 10, search });
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
        });
    };



    const loadData = async ({
        page = 1,
        pageSize = 10,
        sort_by,
        sort_order,
        search
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getMajorList({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getMajorList({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
            });
        }

        setData(response);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [])

    if (!hasPermission('access:majors')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:majors') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} ngành học?`}
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
                    {hasPermission('add:majors') && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm ngành học
                        </Button>
                    )}
                </Space>
            </div>

            <div className="bg-white p-4 rounded-md">
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoặc mã ngành"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                    />
                    <Button onClick={() => setSearchValue('')} icon={<CloseOutlined />} />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={HandleSearchMajor}>
                        Tìm kiếm
                    </Button>
                </Space>

                <MajorTable
                    data={data}
                    loading={loading}
                    onEdit={handleEdit}
                    confirmDelete={confirmDelete}
                    onSelectionChange={setSelectedIds}
                    onTableChange={handleTableChange}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />
            </div>

            <MajorModalForm
                open={openModal}
                editingMajor={editingMajor}
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
                <p>Bạn có chắc chắn muốn xoá ngành này không?</p>
            </Modal>
        </div>
    );
};

export default Page;
