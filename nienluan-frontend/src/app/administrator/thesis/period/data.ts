import {Semester} from "@/types/semester";
import {ThesisReportPeriod} from "@/types/thesisReportPeriod";

export const semesterSamples: Semester[] = [
    {
        id: 1,
        name: 'Học kỳ 1 - Năm học 2023-2024',
        startDate: '2023-08-15',
        endDate: '2023-12-15',
        status: 'Inactive',
    },
    {
        id: 2,
        name: 'Học kỳ 2 - Năm học 2023-2024',
        startDate: '2024-01-10',
        endDate: '2024-05-10',
        status: 'Active',
    },
];

export const initialThesisReportPeriods: ThesisReportPeriod[] = [
    {
        id: 1,
        name: 'Đợt 1 - Nộp báo cáo luận văn',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        semester: semesterSamples[1],
        status: 'Active',
    },
    {
        id: 2,
        name: 'Đợt 2 - Nộp báo cáo luận văn',
        startDate: '2024-04-01',
        endDate: '2024-04-15',
        semester: semesterSamples[1],
        status: 'Inactive',
    },
];
