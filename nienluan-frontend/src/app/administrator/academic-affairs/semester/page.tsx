'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import SemesterTable from './SemesterTable';
import SemesterModalForm from './SemesterModalForm';
import { Semester } from "@/types/semester";
import { PageData } from '@/components/Table';
import { deleteMultiSemester, deleteSemester, filterSemester, getSemester } from './semesterService';
import { getYearList } from '../year/academicYearService';
import { AcademicYear } from '@/types/academicYear';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { showNotification } from '@/store/noti/slice';
import { usePermission } from '@/lib/auth';


const Page = () => {
    const dispatch = useDispatch();
    const { hasPermission } = usePermission();
    const [data, setData] = useState<PageData<Semester>>({
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
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDeleteMulti, setLoadingDeleteMulti] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [year, setYear] = useState<AcademicYear[]>([]);
    const [filterYear, setFilterYear] = useState<AcademicYear[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };


    const handleAdd = () => {
        setEditingSemester(null);
        setOpenModal(true);
    };

    const handleEdit = (semester: Semester) => {
        setEditingSemester(semester);
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
            const response = await deleteSemester(id);

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
                year: selectedYear
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
            const response = await deleteMultiSemester(selectedIds);

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
                year: selectedYear
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
            year: selectedYear
        });
        setOpenModal(false);
    };

    const resetFilter = () => {
        setSearchValue('');
        setSelectedYear(null);
    }

    const searchSemester = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const year = selectedYear;
            const response = await filterSemester({ page, per_page: 10, search, year });
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
            year: selectedYear
        });
    };


    const loadData = async ({
        page = 1,
        pageSize = 10,
        sort_by,
        sort_order,
        search,
        year
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
        year?: number | null
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getSemester({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            year
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getSemester({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                year
            });
        }

        setData(response);
        setLoading(false);
    };

    const loadYearData = async () => {
        const response = await getYearList();
        setYear(response.data);
        setFilterYear(response.data.filter(x => x.is_active == true));
    };

    useEffect(() => {
        loadYearData();
    }, []);

    useEffect(() => {
        if (!selectedYear && year.length > 0) {
            const activeYear = year.find((y) => y.is_active);
            if (activeYear) {
                const yearId = activeYear.id;
                setSelectedYear(yearId);
                loadData({
                    search: searchValue,
                    year: yearId
                });
            }
        }
    }, [year]);


    if (!hasPermission('access:semesters')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:semesters') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} kỳ học?`}
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
                    {hasPermission('add:semesters') && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm kỳ học
                        </Button>
                    )}
                </Space>
            </div>

            <div className="bg-white p-4 rounded-md">
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Select
                        placeholder="Năm học"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        style={{ flex: 1, minWidth: 200 }}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const label = (option?.label ?? option?.children) as string;
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {year.map((academicYear) => (
                            <Select.Option key={academicYear.id} value={academicYear.id}>
                                {academicYear.name}
                            </Select.Option>
                        ))}
                    </Select>

                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm kỳ học"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                    />
                    <Button onClick={resetFilter} icon={<CloseOutlined />} />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={searchSemester}>
                        Tìm kiếm
                    </Button>
                </Space>

                <SemesterTable
                    data={data}
                    onEdit={handleEdit}
                    confirmDelete={confirmDelete}
                    onSelectionChange={setSelectedIds}
                    loading={loading}
                    onTableChange={handleTableChange}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />
            </div>

            <SemesterModalForm
                open={openModal}
                editingSemester={editingSemester}
                onCancel={() => setOpenModal(false)}
                onOk={handleModalOk}
                academicYears={filterYear} />

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
                <p>Bạn có chắc chắn muốn xoá học kỳ này không?</p>
            </Modal>
        </div>
    );
};

export default Page;
