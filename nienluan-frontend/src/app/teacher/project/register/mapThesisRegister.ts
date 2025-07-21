import { ThesisAttachment } from "@/types/thesisAndThesisAttachment";
import { ThesisRegister } from "@/types/thesisRegister";


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

interface ApiTeacher {
    id: number;
    name: string;
}

interface ApiThesis {
    id: number;
    name: string;
    description: string | null;
    lecturer: ApiTeacher;
    start_date: string;
    end_date: string;
    attachments: ApiThesisAttachment[];
    report_period: ApiReportPeriod;
}

interface ApiStudent {
    id: number;
    name: string;
}

interface ApiThesisRegister {
    id: number;
    thesis: ApiThesis;
    students: ApiStudent[];
    status: string;
    reject_note?: string
}

export function mapThesisRegister(data: ApiThesisRegister): ThesisRegister {
    return {
        id: data.id,
        thesis: {
            id: data.thesis.id,
            name: data.thesis.name,
            description: data.thesis.description,
            startDate: data.thesis.start_date,
            endDate: data.thesis.end_date,
            lecturer: {
                id: data.thesis.lecturer.id,
                name: data.thesis.lecturer.name,
            },
            attachments: data.thesis.attachments.map((file): ThesisAttachment => ({
                id: file.id,
                thesisId: file.thesis_id,
                filePath: file.file_path,
                fileName: file.file_name,
            })),
            reportPeriod: {
                id: data.thesis.report_period.id,
                name: data.thesis.report_period.name,
                startDate: data.thesis.report_period.start_date,
                endDate: data.thesis.report_period.end_date,
                status: data.thesis.report_period.is_active ? "Active" : "Inactive",
                semester: {
                    id: data.thesis.report_period.semester.id,
                    name: data.thesis.report_period.semester.name,
                    startDate: data.thesis.report_period.semester.start_date,
                    endDate: data.thesis.report_period.semester.end_date,
                    status: data.thesis.report_period.semester.is_active ? "Active" : "Inactive",
                    year: {
                        id: data.thesis.report_period.semester.academic_year.id,
                        name: data.thesis.report_period.semester.academic_year.name,
                        startDate: data.thesis.report_period.semester.academic_year.start_date,
                        endDate: data.thesis.report_period.semester.academic_year.end_date,
                        status: data.thesis.report_period.semester.academic_year.is_active ? "Active" : "Inactive",
                    },
                },
            },
        },
        student: data.students.map((item): ApiStudent => ({
            id: item.id,
            name: item.name
        })),
        status: data.status,
        rejectNote: data.reject_note
    };
}
