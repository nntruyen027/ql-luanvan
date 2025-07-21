'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ProjectTable from './ProjectTable';
import { Project } from "@/types/project";
import ProjectModalForm from "@/app/teacher/project/publish/ProjectModalForm";
import { useDispatch } from 'react-redux';
import { PageData } from '@/components/Table';
import { Thesis } from '@/types/thesisAndThesisAttachment';
import { deleteMultiThesisPublish, deleteThesisPublish, filterThesisPublish, getReportPeriodBySemester, getStudent, getThesisPublishList, registerThesis } from './thesisPublishService';
import { AcademicYear } from '@/types/academicYear';
import { Semester } from '@/types/semester';
import { getYearList } from '@/app/administrator/academic-affairs/year/academicYearService';
import { getSemesterByYear } from '@/app/administrator/thesis/period/periodService';
import { ThesisReportPeriod } from '@/types/thesisReportPeriod';
import { toast } from 'react-toastify';
import { showNotification } from '@/store/noti/slice';
import { usePermission } from '@/lib/auth';


const ThesisProjectPage = () => {
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
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

    type StudentOptions = {
        label: string,
        value: number
    }

    const isFirstLoad = useRef(true);

    const [year, setYear] = useState<AcademicYear[]>([]);
    const [semester, setSemester] = useState<Semester[]>([]);
    const [reportPeriod, setReportPeriod] = useState<ThesisReportPeriod[]>([]);
    const [student, setStudent] = useState<StudentOptions[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    const [searchValue, setSearchValue] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>();
    const [selectedSemester, setSelectedSemester] = useState<number | null>();
    const [selectedReportPeriod, setSelectedReportPeriod] = useState<number | null>();
    const [openModal, setOpenModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDeleteMulti, setLoadingDeleteMulti] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);

    const [isConfirmOpenRegister, setIsConfirmOpenRegister] = useState(false);
    const [rowId, setRowId] = useState<number | null>(null);


    const confirmRegister = (id: number) => {
        setRowId(id);
        setIsConfirmOpenRegister(true);
    };

    const confirmDelete = (id: number) => {
        setRowId(id);
        setIsConfirmOpen(true);
    };


    const handleConfirmRegister = async () => {
        if (rowId !== null) {
            await handleRegister(rowId);
            setIsConfirmOpenRegister(false);
            setRowId(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (rowId !== null) {
            await handleDelete(rowId);
            setIsConfirmOpen(false);
            setRowId(null);
        }
    };


    const handleRegister = async (id: number) => {
        try {
            setLoadingRegister(true);

            const payload = {
                student_ids: selectedStudents
            }

            const response = await registerThesis(id, payload);

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
            setLoadingRegister(false);
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

            form.resetFields();

        } catch (error: any) {
            form.resetFields();
            setLoadingRegister(false);
            const msg = error?.response?.data?.message || 'Xoá thất bại. Vui lòng thử lại.';
            toast.error(msg, {
                position: 'top-right',
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoadingDelete(true);
            const response = await deleteThesisPublish(id);

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

    const handleMultiDelete = async () => {
        try {
            setLoadingDeleteMulti(true);
            const response = await deleteMultiThesisPublish(selectedIds);

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

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setOpenModal(true);
    }

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
        setEditingProject(null);
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
        let response = await getThesisPublishList({
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
            response = await getThesisPublishList({
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
            const year = selectedYear;
            const semester = selectedSemester;
            const reportPeriod = selectedReportPeriod;
            const response = await filterThesisPublish({ page, per_page: 10, search, year, semester, reportPeriod });
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

    const handleChange = (value: number[]) => {
        setSelectedStudents(value);
    };

    const getThesisStudent = async () => {
        const response = await getStudent();
        setStudent(response.data);
    }

    useEffect(() => {
        if (isConfirmOpenRegister) {
            getThesisStudent();
        }
    }, [isConfirmOpenRegister])

    const handleCloseRegister = () => {
        setIsConfirmOpenRegister(false)
        form.resetFields();
    }

    if (!hasPermission('access:thesis-publish')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div>
            <div className="text-right mb-4 p-4 flex items-center justify-end bg-white rounded-md">
                <Space>
                    {hasPermission('delete:thesis-publish') && (
                        <Popconfirm
                            title="Xác nhận xoá hàng loạt"
                            description={`Bạn có chắc chắn muốn xoá ${selectedIds.length} đề tài?`}
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
                    {hasPermission('add:thesis-publish') && (
                        <Button type={'primary'} icon={<PlusOutlined />} onClick={handleAdd}>
                            Thêm đề tài
                        </Button>
                    )}
                </Space>
            </div>

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
                    <Input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm"
                        suffix={<SearchOutlined style={{ color: '#999' }} />}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <Button onClick={() => {
                        setSearchValue('')
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
                    confirmDelete={confirmDelete}
                    confirmRegister={confirmRegister}
                    onEdit={handleEdit}
                    onSelectionChange={setSelectedIds}
                    onTableChange={handleTableChange}
                    currentPage={paginationState.page}
                    pageSize={paginationState.size}
                />

                <ProjectModalForm
                    open={openModal}
                    editingProject={editingProject}
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
                    <p>Bạn có chắc chắn muốn xoá đề tài đã công bố này không?</p>
                </Modal>


                <Modal
                    title="Đăng ký đề tài"
                    open={isConfirmOpenRegister}
                    onOk={handleConfirmRegister}
                    confirmLoading={loadingRegister}
                    onCancel={handleCloseRegister}
                    okText="Đăng ký"
                    cancelText="Huỷ"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="sinhVienThucHien"
                            label="Sinh viên thực hiện"
                            required={true}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (value && value.length > 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Vui lòng chọn ít nhất 1 sinh viên thực hiện đề tài'));
                                    },
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Chọn sinh viên thực hiện đề tài"
                                value={selectedStudents}
                                onChange={handleChange}
                                options={student.map(sd => ({
                                    label: sd.label,
                                    value: sd.value,
                                }))}
                            />
                        </Form.Item>

                    </Form>
                </Modal>
            </div>

        </div >
    );
};

export default ThesisProjectPage;
