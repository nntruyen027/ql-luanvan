'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ThesisReportPeriodTable from './PeriodTable';
import ThesisReportPeriodModalForm from './PeriodModalForm';
import { ThesisReportPeriod } from "@/types/thesisReportPeriod";
import { PageData } from '@/components/Table';
import { deleteMultiReportPeriod, deleteReportPeriod, filterReportPeriod, getPeriodList, getSemesterByYear } from './periodService';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { getYearList } from '../../academic-affairs/year/academicYearService';
import { AcademicYear } from '@/types/academicYear';
import { Semester } from '@/types/semester';
import { usePermission } from '@/lib/auth';


const ThesisReportPeriodPage = () => {
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const isFirstLoad = useRef(true);
    const [data, setData] = useState<PageData<ThesisReportPeriod>>({
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
    const [year, setYear] = useState<AcademicYear[]>([]);
    const [semester, setSemester] = useState<Semester[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<ThesisReportPeriod | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>();
    const [selectedSemester, setSelectedSemester] = useState<number | null>();
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
        setEditingPeriod(null);
        setOpenModal(true);
    };

    const handleEdit = (period: ThesisReportPeriod) => {
        setEditingPeriod(period);
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
            const response = await deleteReportPeriod(id);

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
                year: selectedYear,
                semester: selectedSemester
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
            const response = await deleteMultiReportPeriod(selectedIds);

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
                year: selectedYear,
                semester: selectedSemester
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
            year: selectedYear,
            semester: selectedSemester
        });
        setOpenModal(false);
    };


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
            year: selectedYear,
            semester: selectedSemester
        });
    };


    const loadData = async ({
        page = 1,
        pageSize = 10,
        sort_by,
        sort_order,
        search,
        year,
        semester
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
        year?: number | null,
        semester?: number | null
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getPeriodList({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            year,
            semester
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getPeriodList({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                year,
                semester
            });
        }

        setData(response);
        setLoading(false);
    };

    const loadYearData = async () => {
        const response = await getYearList();
        setYear(response.data);
    };

    useEffect(() => {
        loadYearData();
    }, []);

    useEffect(() => {
        if (selectedYear == null) {
            setSelectedSemester(null);
        }
    }, [selectedYear]);


    const fetchSemestersByYear = async (yearId: number) => {
        if (!yearId) {
            setSemester([]);
            return;
        }

        const response = await getSemesterByYear(yearId);
        setSemester(response.data);
        setSelectedSemester(null); // reset học kỳ khi đổi năm học
    };


    useEffect(() => {
        if (!selectedYear && year.length > 0 && isFirstLoad.current) {
            const activeYear = year.find((y) => y.is_active);
            if (activeYear) {
                const yearId = activeYear.id;
                setSelectedYear(yearId);
                fetchSemestersByYear(yearId);
            }
        }
    }, [year]);

    useEffect(() => {
        if (!selectedSemester && semester.length > 0 && isFirstLoad.current) {
            const activeSemester = semester.find((y) => y.is_active === 1);
            if (activeSemester) {
                const semesterId = activeSemester.id;
                setSelectedSemester(semesterId);
            }
        }
    }, [semester])

    useEffect(() => {
        // Gọi loadData chỉ lần đầu
        if (isFirstLoad.current && selectedSemester) {
            loadData({
                search: searchValue,
                year: selectedYear,
                semester: selectedSemester
            });
            isFirstLoad.current = false; // Đánh dấu đã load xong lần đầu
        }
    }, [selectedSemester])


    const handleYearChange = (value: number) => {
        setSelectedYear(value);
        fetchSemestersByYear(value);
    };

    const searchReportPeriod = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const year = selectedYear;
            const semester = selectedSemester;
            const response = await filterReportPeriod({ page, per_page: 10, search, year, semester });
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

    if (!hasPermission('access:registration-period')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:registration-period') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} kỳ báo cáo?`}
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

                    {hasPermission('add:registration-period') && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm kỳ báo cáo
                        </Button>
                    )}
                </Space>
            </div>

            <div className="bg-white p-4 rounded-md">
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Select
                        placeholder="Năm học"
                        value={selectedYear}
                        onChange={handleYearChange}
                        style={{ flex: 1, minWidth: 200 }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const label = (option?.label ?? option?.label) as string;
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={year.map(year => ({
                            label: year.name,
                            value: year.id,
                        }))}
                    />
                    <Select
                        placeholder="Học kỳ"
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                        style={{ flex: 1, minWidth: 200 }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const label = (option?.label ?? option?.label) as string;
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={semester.map(semester => ({
                            label: semester.name,
                            value: semester.id,
                        }))}
                        disabled={!selectedYear}
                    />
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm kỳ báo cáo"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                    />
                    <Button onClick={() => {
                        setSearchValue('')
                        setSelectedYear(null)
                        setSelectedSemester(null)
                    }} icon={<CloseOutlined />} />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={searchReportPeriod}>
                        Tìm kiếm
                    </Button>
                </Space>

                <ThesisReportPeriodTable
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

            <ThesisReportPeriodModalForm
                open={openModal}
                editingPeriod={editingPeriod}
                onCancel={() => setOpenModal(false)}
                onOk={handleModalOk} />

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
                <p>Bạn có chắc chắn muốn xoá kỳ báo cáo này không?</p>
            </Modal>
        </div>
    );
};

export default ThesisReportPeriodPage;
