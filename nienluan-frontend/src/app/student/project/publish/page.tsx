'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import ProjectTable from './ProjectTable';
import { PageData } from '@/components/Table';
import { Thesis } from '@/types/thesisAndThesisAttachment';
import { filterThesisPublish, getReportPeriodBySemester, getThesisPublishList } from './thesisPublishService';
import { AcademicYear } from '@/types/academicYear';
import { Semester } from '@/types/semester';
import { getYearList } from '@/app/administrator/academic-affairs/year/academicYearService';
import { getSemesterByYear } from '@/app/administrator/thesis/period/periodService';
import { ThesisReportPeriod } from '@/types/thesisReportPeriod';
import { toast } from 'react-toastify';
import { getLecturerOptions } from '../register/thesisRegisterService';
import { Teacher } from '@/types/user';
import { usePermission } from '@/lib/auth';


const ThesisProjectPage = () => {
    const { hasPermission } = usePermission();
    const [data, setData] = useState<PageData<Thesis>>({
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


    const isFirstLoad = useRef(true);

    const [year, setYear] = useState<AcademicYear[]>([]);
    const [semester, setSemester] = useState<Semester[]>([]);
    const [reportPeriod, setReportPeriod] = useState<ThesisReportPeriod[]>([]);

    const [searchValue, setSearchValue] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | null>();
    const [selectedSemester, setSelectedSemester] = useState<number | null>();
    const [selectedReportPeriod, setSelectedReportPeriod] = useState<number | null>();
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [selectedLecturer, setSelectedLecturer] = useState<number | null>();
    const [lecturer, setLecturer] = useState<Teacher[]>([]);


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
            lecturer: selectedLecturer,
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
        lecturer,
        year,
        semester,
        reportPeriod,
    }: {
        page?: number;
        pageSize?: number;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        search?: string;
        lecturer?: number | null,
        year?: number | null,
        semester?: number | null,
        reportPeriod?: number | null,
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getThesisPublishList({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            lecturer,
            year,
            semester,
            reportPeriod,
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getThesisPublishList({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                lecturer,
                year,
                semester,
                reportPeriod,
            });
        }

        setData(response);
        setLoading(false);
    };

    const loadLecturer = async () => {
        const response = await getLecturerOptions();
        setLecturer(response.data);
    };


    const loadYearData = async () => {
        const response = await getYearList();
        setYear(response.data);
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
                const reportPeriodId = activeReportPeriod.id;
                setSelectedReportPeriod(reportPeriodId);
            }
        }
    }, [reportPeriod]);


    useEffect(() => {
        // Gọi loadData chỉ lần đầu
        if (isFirstLoad.current && selectedReportPeriod) {
            loadData({
                search: searchValue,
                lecturer: selectedLecturer,
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



    const searchThesisPublish = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const lecturer = selectedLecturer;
            const year = selectedYear;
            const semester = selectedSemester;
            const reportPeriod = selectedReportPeriod;
            const response = await filterThesisPublish({ page, per_page: 10, search, lecturer, year, semester, reportPeriod });
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

    if (!hasPermission('access:thesis-publish')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>

            <div className="bg-white p-4 rounded-md">
                <Space>
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
                    <Select
                        placeholder="Kỳ báo cáo"
                        value={selectedReportPeriod}
                        onChange={setSelectedReportPeriod}
                        style={{ flex: 1, minWidth: 200 }}
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
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <Button onClick={() => {
                        setSearchValue('')
                        setSelectedLecturer(null)
                        setSelectedYear(null)
                        setSelectedSemester(null)
                        setSelectedReportPeriod(null)
                    }} icon={<CloseOutlined />} />
                    <Button type="primary" icon={<SearchOutlined />} loading={loadingSearch} onClick={searchThesisPublish}>
                        Tìm kiếm
                    </Button>
                </Space>

                <ProjectTable
                    data={data}
                    loading={loading}
                    onTableChange={handleTableChange}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />

            </div>

        </div >
    );
};

export default ThesisProjectPage;
