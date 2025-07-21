'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import ProjectTable from './ProjectTable';
import { PageData } from '@/components/Table';
import { ThesisRegister } from '@/types/thesisRegister';
import { filterThesisRegister, getLecturerOptions, getThesisRegisterList, withdrawThesis } from './thesisRegisterService';
import { AcademicYear } from '@/types/academicYear';
import { Semester } from '@/types/semester';
import { ThesisReportPeriod } from '@/types/thesisReportPeriod';
import { getYearList } from '@/app/administrator/academic-affairs/year/academicYearService';
import { getSemesterByYear } from '@/app/administrator/thesis/period/periodService';
import { getReportPeriodBySemester } from '../publish/thesisPublishService';
import { Teacher } from '@/types/user';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/noti/slice';
import { usePermission } from '@/lib/auth';


const ThesisProjectPage = () => {
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const isFirstLoad = useRef(true);
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    const userId = user?.id || null;
    const [data, setData] = useState<PageData<ThesisRegister>>({
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
    const [reportPeriod, setReportPeriod] = useState<ThesisReportPeriod[]>([]);
    const [lecturer, setLecturer] = useState<Teacher[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string | null>();
    const [selectedYear, setSelectedYear] = useState<number | null>();
    const [selectedSemester, setSelectedSemester] = useState<number | null>();
    const [selectedReportPeriod, setSelectedReportPeriod] = useState<number | null>();
    const [selectedLecturer, setSelectedLecturer] = useState<number | null>();
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);


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
            reportPeriod: selectedReportPeriod,
            lecturer: selectedLecturer,
            status: selectedStatus
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
        lecturer,
        status
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
        year?: number | null,
        semester?: number | null,
        reportPeriod?: number | null,
        lecturer?: number | null,
        status?: string | null
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getThesisRegisterList({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            year,
            semester,
            reportPeriod,
            lecturer,
            status
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getThesisRegisterList({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                year,
                semester,
                reportPeriod,
                lecturer,
                status
            });
        }

        setData(response);
        setLoading(false);
    };


    const loadYearData = async () => {
        const response = await getYearList();
        setYear(response.data);
    };

    const loadLecturer = async () => {
        const response = await getLecturerOptions();
        setLecturer(response.data);
    };

    useEffect(() => {
        loadYearData();
        loadLecturer();
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

        if (!selectedLecturer && lecturer.length > 0 && isFirstLoad.current) {
            const activeLecturer = lecturer.find((y) => y.id == userId);
            if (activeLecturer) {
                setSelectedLecturer(activeLecturer.id);
            }
        }
    }, [reportPeriod, lecturer]);


    useEffect(() => {
        if (!selectedLecturer && lecturer.length > 0 && isFirstLoad.current) {
            const activeLecturer = lecturer.find((y) => y.id == userId);
            if (activeLecturer) {
                setSelectedLecturer(activeLecturer.id);
            }
        }
    }, [lecturer]);

    useEffect(() => {
        // Gọi loadData chỉ lần đầu
        if (isFirstLoad.current && selectedReportPeriod) {
            loadData({
                search: searchValue,
                year: selectedYear,
                semester: selectedSemester,
                reportPeriod: selectedReportPeriod,
                lecturer: selectedLecturer
            });
            isFirstLoad.current = false; // Đánh dấu đã load xong lần đầu
        }
    }, [selectedReportPeriod]);


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

    const searchThesisRegister = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const year = selectedYear;
            const semester = selectedSemester;
            const reportPeriod = selectedReportPeriod;
            const lecturer = selectedLecturer;
            const status = selectedStatus;
            const response = await filterThesisRegister({
                page,
                per_page: 10,
                search, year,
                semester,
                reportPeriod,
                lecturer,
                status
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

    const handleWithdrawThesis = async (id: number) => {
        try {
            const response = await withdrawThesis(id);

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

            loadData({
                search: searchValue,
                year: selectedYear,
                semester: selectedSemester,
                reportPeriod: selectedReportPeriod,
                lecturer: selectedLecturer
            });

        } catch (error: any) {

            const msg = error?.response?.data?.message || 'Rút đề tài thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    }


    if (!hasPermission('access:thesis-register')) {
        window.location.href = "/auth/forbidden";
    }
    return (
        <div>
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
                    <Select
                        placeholder="Giảng viên hướng dẫn"
                        value={selectedLecturer}
                        onChange={setSelectedLecturer}
                        style={{ flex: 1, minWidth: 200 }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const label = (option?.label ?? option?.label) as string;
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={lecturer.map(teacher => ({
                            label: teacher.name,
                            value: teacher.id,
                        }))}
                    />
                    <Select
                        placeholder="Trạng thái"
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        style={{ minWidth: 120 }}
                        allowClear
                        options={[
                            { label: 'Chờ duyệt', value: 'pending' },
                            { label: 'Đã duyệt', value: 'approved' },
                            { label: 'Từ chối', value: 'rejected' },
                        ]}
                    />
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <Button
                        onClick={() => {
                            setSelectedYear(null);
                            setSelectedLecturer(null);
                            setSelectedStatus(null);
                            setSearchValue('');
                        }}
                        icon={<CloseOutlined />}
                    />
                    <Button type="primary" icon={<SearchOutlined />}
                        loading={loadingSearch}
                        onClick={searchThesisRegister}>
                        Tìm kiếm
                    </Button>
                </Space>

                <ProjectTable
                    data={data}
                    loading={loading}
                    onWithdraw={handleWithdrawThesis}
                    onTableChange={handleTableChange}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />
            </div>

        </div>
    );
};

export default ThesisProjectPage;
