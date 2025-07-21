import { Committee } from "@/types/committee";
import { ThesisAttachment } from "@/types/thesisAndThesisAttachment";


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
    registrations: ApiThesisRegister
}

interface ApiStudent {
    id: number;
    name: string;
}


interface ApiMember {
    id: number;
    user: ApiTeacher; // Một giảng viên
    position: string;
}


interface ApiThesisRegister {
    id: number;
    students: ApiStudent[];
    status: string;
}

interface ApiCommitteeThesis {
    id: number;
    thesis: ApiThesis;
    members: ApiMember[]
}


export function mapCommittee(data: ApiCommitteeThesis): Committee {
    const firstRegistration = data.thesis.registrations?.[0]; // Lấy phần tử đầu tiên nếu có

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
            registrations: firstRegistration
                ? {
                    id: firstRegistration.id,
                    status: firstRegistration.status,
                    students: Array.isArray(firstRegistration.students)
                        ? firstRegistration.students.map((student): ApiStudent => ({
                            id: student.id,
                            name: student.name
                        }))
                        : [],
                }
                : undefined,
        },
        members: data.members.map((item): ApiMember => ({
            id: item.id,
            user: {
                id: item.user.id,
                name: item.user.name
            },
            position: item.position
        }))
    };
}
