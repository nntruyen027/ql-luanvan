'use client'

import { Button, Form, Input, Select, Space } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Task } from '@/types/project';
import TaskModalForm from './TaskModalForm';
import TaskTable from './TaskTable';
import { ThesisReportPeriod } from "@/types/thesisReportPeriod";
import { useEffect, useRef, useState } from "react";
import { AcademicYear } from '@/types/academicYear';
import { Semester } from '@/types/semester';
import { getYearList } from '@/app/administrator/academic-affairs/year/academicYearService';
import { getReportPeriodBySemester } from '../../project/publish/thesisPublishService';
import { getSemesterByYear } from '@/app/administrator/thesis/period/periodService';
import { ThesisRegister } from '@/types/thesisRegister';
import { filterThesisTask, getThesisTask, thesisByTime } from './thesisTaskService';
import { PageData } from '@/components/Table';
import { ThesisTask } from '@/types/thesisTask';
import { toast } from 'react-toastify';
import TaskDetailModal from './TaskDetailModal';
import { usePermission } from '@/lib/auth';



const ProjectTaskPage = () => {
    const { hasPermission } = usePermission();
    const [form] = Form.useForm();
    const isFirstLoad = useRef(true);
    const [data, setData] = useState<PageData<ThesisTask>>({
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
    const [theses, setTheses] = useState<ThesisRegister[]>([]);

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);


    const [selectedThesis, setSelectedThesis] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const [selectedYear, setSelectedYear] = useState<number | null>();
    const [selectedSemester, setSelectedSemester] = useState<number | null>();
    const [selectedReportPeriod, setSelectedReportPeriod] = useState<number | null>();
    const [searchValue, setSearchValue] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const [rowId, setRowId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setRowId(id);
        setIsConfirmOpen(true);
    };

    const confirmReview = (task: ThesisTask) => {
        if (task) {
            setRowId(task.id);
            form.setFieldsValue({
                danhGia: task.instructorStatus,
                ghiChu: task.instructorNote
            });
            setIsConfirmOpenReview(true);
        }
    };


    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setOpenModal(true);
    };

    const handleView = (task: Task) => {
        setEditingTask(task);
        setOpenDetailModal(true);
    };


    const handleModalOk = () => {
        setOpenModal(false);
        loadData({
            page: paginationState.page,
            pageSize: paginationState.size,
            sort_by: paginationState.sortField,
            sort_order: paginationState.sortOrder,
            search: searchValue,
            year: selectedYear,
            semester: selectedSemester,
            reportPeriod: selectedReportPeriod,
            thesis: selectedThesis,
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
        thesis,
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
        thesis?: number | null,
        status?: string | null
    } = {}) => {
        setLoading(true);
        let currentPage = page;
        let response = await getThesisTask({
            page,
            per_page: pageSize,
            sort_by,
            sort_order,
            search,
            year,
            semester,
            reportPeriod,
            thesis,
            status
        });

        // Nếu trang hiện tại trống nhưng vẫn còn dữ liệu → lùi về trang trước
        if (currentPage > 1 && response.content.length === 0) {
            currentPage = currentPage - 1;
            response = await getThesisTask({
                page: currentPage,
                per_page: pageSize,
                sort_by,
                sort_order,
                search,
                year,
                semester,
                reportPeriod,
                thesis,
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


    useEffect(() => {
        loadYearData();
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

    useEffect(() => {
        if (selectedReportPeriod == null) {
            setSelectedThesis(null);
        }
    }, [selectedReportPeriod]);

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
        const response = await thesisByTime(year, semester, reportPeriod);
        setTheses(response);
        setSelectedThesis(response[0]?.thesis?.id ?? null);
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
        if (isFirstLoad.current && selectedYear && selectedSemester && selectedReportPeriod && selectedThesis) {
            loadData({
                search: searchValue,
                year: selectedYear,
                semester: selectedSemester,
                reportPeriod: selectedReportPeriod,
                thesis: selectedThesis,
                status: selectedStatus
            });
            isFirstLoad.current = false; // Đánh dấu đã load xong lần đầu
        }
    }, [selectedYear, selectedSemester, selectedReportPeriod, selectedThesis]);


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
            thesis: selectedThesis,
            status: selectedStatus
        });
    };


    const searchThesisTask = async () => {
        try {
            setLoadingSearch(true);
            const page = 1;
            const search = searchValue;
            const year = selectedYear;
            const semester = selectedSemester;
            const reportPeriod = selectedReportPeriod;
            const thesis = selectedThesis;
            const status = selectedStatus;
            const response = await filterThesisTask({
                page,
                per_page: 10,
                search, year,
                semester,
                reportPeriod,
                thesis,
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

    if (!hasPermission('access:thesis-task')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>

            <div className="bg-white p-4 rounded-md">
                <Space>
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                        style={{ flex: 1, width: 200 }}
                    />
                    <Select
                        placeholder="Năm học"
                        value={selectedYear}
                        onChange={handleYearChange}
                        style={{ flex: 1, width: 200 }}
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
                        style={{ flex: 1, width: 100 }}
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
                        style={{ flex: 1, width: 100 }}
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
                        placeholder="Chọn đề tài"
                        value={selectedThesis}
                        onChange={setSelectedThesis}
                        style={{ width: 205 }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        disabled={!selectedReportPeriod}
                    >
                        {theses.map(project => (
                            <Select.Option key={project.thesis.id} value={project.thesis.id}>
                                {project.thesis.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Trạng thái"
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        style={{ width: 160 }}
                        allowClear
                    >
                        <Select.Option value="notstarted">Chưa thực hiện</Select.Option>
                        <Select.Option value="doing">Đang thực hiện</Select.Option>
                        <Select.Option value="finished">Hoàn thành</Select.Option>
                        <Select.Option value="cancelled">Đã hủy</Select.Option>
                    </Select>

                    <Button
                        onClick={() => {
                            setSearchValue('');
                            setSelectedYear(null);
                            setSelectedSemester(null);
                            setSelectedReportPeriod(null);
                            setSelectedThesis(null);
                            setSelectedStatus(null);
                        }}
                        icon={<CloseOutlined />}
                    />
                    <Button type="primary" icon={<SearchOutlined />}
                        loading={loadingSearch}
                        onClick={searchThesisTask}>
                        Tìm kiếm
                    </Button>


                </Space>
            </div>


            <TaskTable
                data={data}
                onEdit={handleEdit}
                onView={handleView}
                confirmDelete={confirmDelete}
                onReview={confirmReview}
                onTableChange={handleTableChange}
                loading={loading}
                currentPage={paginationState.page}
                pageSize={paginationState.size}
            />

            <TaskModalForm
                open={openModal}
                edittingTask={editingTask}
                onCancel={() => setOpenModal(false)}
                onOk={handleModalOk}
                thesis={theses}
            />

            <TaskDetailModal
                open={openDetailModal}
                edittingTask={editingTask}
                onCancel={() => setOpenDetailModal(false)}
            />

        </div>
    );
};

export default ProjectTaskPage;
