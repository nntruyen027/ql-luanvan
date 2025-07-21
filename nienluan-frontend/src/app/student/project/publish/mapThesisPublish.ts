import { formatDate } from "@/lib/utils";
import { ObjTeacher, Thesis, ThesisAttachment } from "@/types/thesisAndThesisAttachment";


interface ApiAcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

interface ApiSemester {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    academic_year: ApiAcademicYear;
}

interface ApiReportPeriod {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    semester: ApiSemester;
}

interface ApiThesisAttachment {
    id: number;
    thesis_id: number;
    file_path: string;
    file_name: string;
}

interface ApiThesis {
    id: number;
    name: string;
    description: string | null;
    report_period_id: number;
    start_date: string | null;
    end_date: string | null;
    attachments: ApiThesisAttachment[];
    report_period: ApiReportPeriod;
    lecturer: ObjTeacher
}

export function mapThesisPublish(data: ApiThesis): Thesis {
    return {
        id: data.id,
        name: data.name,
        description: data.description ?? null,
        startDate: formatDate(data.start_date) ?? null,
        endDate: formatDate(data.end_date) ?? null,
        lecturer: {
            id: data.lecturer.id,
            name: data.lecturer.name,
            email: data.lecturer.email,
            phone_number: data.lecturer.phone_number
        },
        attachments: data.attachments.map((file): ThesisAttachment => ({
            id: file.id,
            thesisId: file.thesis_id,
            filePath: file.file_path,
            fileName: file.file_name,
        })),
        reportPeriod: {
            id: data.report_period.id,
            name: data.report_period.name,
            startDate: data.report_period.start_date,
            endDate: data.report_period.end_date,
            status: data.report_period.is_active ? "Active" : "Inactive",
            semester: {
                id: data.report_period.semester.id,
                name: data.report_period.semester.name,
                startDate: data.report_period.semester.start_date,
                endDate: data.report_period.semester.end_date,
                status: data.report_period.semester.is_active ? "Active" : "Inactive",
                year: {
                    id: data.report_period.semester.academic_year.id,
                    name: data.report_period.semester.academic_year.name,
                    startDate: data.report_period.semester.academic_year.start_date,
                    endDate: data.report_period.semester.academic_year.end_date,
                    status: data.report_period.semester.academic_year.is_active ? "Active" : "Inactive",
                },
            },
        },
    };
}
