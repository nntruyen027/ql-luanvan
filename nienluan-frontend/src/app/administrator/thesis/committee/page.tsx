'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CommitteeTable from './CommitteeTable';
import CommitteeModalForm from './CommitteeModalForm';
import { Committee } from "@/types/committee";
import { AcademicYear } from '@/types/academicYear';
import { Semester } from '@/types/semester';
import { ThesisReportPeriod } from '@/types/thesisReportPeriod';
import { getYearList } from '../../academic-affairs/year/academicYearService';
import { getReportPeriodBySemester } from '@/app/teacher/project/publish/thesisPublishService';
import { getSemesterByYear } from '../period/periodService';
import { thesisActiveByTime } from '@/app/teacher/thesis/project/thesisTaskService';
import { ThesisRegister } from '@/types/thesisRegister';
import { Teacher } from '@/types/user';
import { deleteCommittee, deleteMultiCommittee, filterCommittee, getCommitteeList, getTeacherOptions } from './committeeService';
import { PageData } from '@/components/Table';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { toast } from 'react-toastify';
import { usePermission } from '@/lib/auth';


const ThesisCommitteePage = () => {
    const isFirstLoad = useRef(true);
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const [data, setData] = useState<PageData<Committee>>({
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
    const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [theses, setTheses] = useState<ThesisRegister[]>([]);
    const [teacher, setTeacher] = useState<Teacher[]>([]);

    const [selectedYear, setSelectedYear] = useState<number | null>();
    const [selectedSemester, setSelectedSemester] = useState<number | null>();
    const [selectedReportPeriod, setSelectedReportPeriod] = useState<number | null>();

    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDeleteMulti, setLoadingDeleteMulti] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const [year, setYear] = useState<AcademicYear[]>([]);
    const [semester, setSemester] = useState<Semester[]>([]);
    const [reportPeriod, setReportPeriod] = useState<ThesisReportPeriod[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [rowId, setRowId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setRowId(id);
        setIsConfirmOpen(true);
    };

    const handleEdit = (project: Committee) => {
        setEditingCommittee(project);
        setOpenModal(true);
    };

    const handleConfirmDelete = async () => {
        if (rowId !== null) {
            await handleDelete(rowId);
            setIsConfirmOpen(false);
            setRowId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoadingDelete(true);
            const response = await deleteCommittee(id);

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
                semester: selectedSemester,
                reportPeriod: selectedReportPeriod
            });

        } catch (error: any) {
            setLoadingDelete(false);
            const msg = error?.response?.data?.message || 'Xoá thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }

    };

    // Xoá nhiều đề tài
    const handleMultiDelete = async () => {
        try {
            setLoadingDeleteMulti(true);
            const response = await deleteMultiCommittee(selectedIds);

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
                semester: selectedSemester,
                reportPeriod: selectedReportPeriod
            });

        } catch (error: any) {
            setLoadingDeleteMulti(false);
            const msg = error?.response?.data?.message || 'Xoá thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    };

    // Xử lý khi submit modal (thêm hoặc sửa)
    const handleModalOk = () => {
        loadData({
            page: paginationState.page,
            pageSize: paginationState.size,
            sort_by: paginationState.sortField,
            sort_order: paginationState.sortOrder,
            search: searchValue,
            year: selectedYear,
            semester: selectedSemester,
            reportPeriod: selectedReportPeriod
        });
        setOpenModal(false);
    };

    const handleAdd = () => {
        setEditingCommittee(null);
        setOpenModal(true);
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
            semester: selectedSemester,
            reportPeriod: selectedReportPeriod
        });
    };


    const loadData = async ({
        page = 1,
        pageSize = 10,
        sort_by,
        sort_order,
        search,
        year,
        semester,
        reportPeriod,
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
        year?: number | null,
        semester?: number | null,
        reportPeriod?: number | null,
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getCommitteeList({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            year,
            semester,
            reportPeriod,
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getCommitteeList({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                year,
                semester,
                reportPeriod,
            });
        }

        setData(response);
        setLoading(false);
    };



    const loadYearData = async () => {
        const response = await getYearList();
        setYear(response.data);
    };

    const loadTeacher = async () => {
        const response = await getTeacherOptions();
        setTeacher(response.data);
    };


    useEffect(() => {
        loadYearData();
        loadTeacher();
    }, []);

    useEffect(() => {
        if (selectedYear == null) {
            setSelectedSemester(null);
            setSelectedReportPeriod(null);
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedSemester == null) {
            setSelectedReportPeriod(null);
        }
    }, [selectedSemester]);

    const fetchReportPeriodSemester = async (semesterId: number) => {
        if (!semesterId) {
            setReportPeriod([]);
            return;
        }

        const response = await getReportPeriodBySemester(semesterId);
        setReportPeriod(response.data);
    };

    const fetchSemestersByYear = async (yearId: number) => {
        if (!yearId) {
            setSemester([]);
            return;
        }

        const response = await getSemesterByYear(yearId);
        setSemester(response.data);
    };


    const fetchThesisByTime = async (year: number, semester: number, reportPeriod: number) => {
        const response = await thesisActiveByTime(year, semester, reportPeriod);
        setTheses(response);
    }


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
                fetchReportPeriodSemester(semesterId);
            }
        }
    }, [semester])



    useEffect(() => {
        if (!selectedReportPeriod && reportPeriod.length > 0 && isFirstLoad.current) {
            const activeReportPeriod = reportPeriod.find((y) => y.is_active);
            if (activeReportPeriod) {
                setSelectedReportPeriod(activeReportPeriod.id);
            }
        }
    }, [reportPeriod]);


    useEffect(() => {
        if (selectedYear && selectedSemester && selectedReportPeriod) {
            fetchThesisByTime(selectedYear, selectedSemester, selectedReportPeriod);

        }
    }, [selectedYear, selectedSemester, selectedReportPeriod]);


    useEffect(() => {
        // Gọi loadData chỉ lần đầu
        if (isFirstLoad.current && selectedReportPeriod) {
            loadData({
                search: searchValue,
                year: selectedYear,
                semester: selectedSemester,
                reportPeriod: selectedReportPeriod
            });
            isFirstLoad.current = false; // Đánh dấu đã load xong lần đầu
        }
    }, [selectedReportPeriod])


    const handleYearChange = (value: number) => {
        setSelectedYear(value);
        setSelectedSemester(null);
        fetchSemestersByYear(value);
    };

    const handleSemesterChange = (value: number) => {
        setSelectedSemester(value);
        setSelectedReportPeriod(null);
        fetchReportPeriodSemester(value);
    };


    const searchCommittee = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const year = selectedYear;
            const semester = selectedSemester;
            const reportPeriod = selectedReportPeriod;
            const response = await filterCommittee({
                page, per_page: 10, search,
                year,
                semester,
                reportPeriod
            });
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

    if (!hasPermission('access:defense-committee')) {
        window.location.href = "/auth/forbidden";
    }



    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:defense-committee') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} hội đồng chấm luận văn?`}
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

                    {hasPermission('add:defense-committee') && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm hội đồng
                        </Button>
                    )}
                </Space>
            </div>

            <div className="bg-white p-4 rounded-md">
                <Space style={{ marginBottom: 16, width: '100%' }}>
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                        style={{ flex: 1, minWidth: 200 }}
                    />
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
                        onChange={handleSemesterChange}
                        style={{ flex: 1, minWidth: 100 }}
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
                    <Select
                        placeholder="Kỳ báo cáo"
                        value={selectedReportPeriod}
                        onChange={setSelectedReportPeriod}
                        style={{ flex: 1, minWidth: 100 }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const label = (option?.label ?? option?.label) as string;
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={reportPeriod.map(rp => ({
                            label: rp.name,
                            value: rp.id,
                        }))}
                        disabled={!selectedSemester}
                    />
                    <Button
                        onClick={() => {
                            setSearchValue('');
                            setSelectedYear(null);
                        }}
                        icon={<CloseOutlined />}
                    />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={searchCommittee}>
                        Tìm kiếm
                    </Button>
                </Space>

                <CommitteeTable
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

            <CommitteeModalForm
                open={openModal}
                editingCommittee={editingCommittee}
                onCancel={() => setOpenModal(false)}
                onOk={handleModalOk}
                teachers={teacher}
                thesis={theses}
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
                <p>Bạn có chắc chắn muốn xoá hội đồng luận văn này không?</p>
            </Modal>

        </div>
    );
};

export default ThesisCommitteePage;
