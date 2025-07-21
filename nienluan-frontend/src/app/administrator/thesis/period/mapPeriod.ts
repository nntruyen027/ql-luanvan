import { formatDate } from "@/lib/utils";
import { ThesisReportPeriod } from "@/types/thesisReportPeriod";

interface ApiPeriod {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    semester: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
        is_active: boolean;
        academic_year: {
            id: number;
            name: string;
            start_date: string;
            end_date: string;
            is_active: boolean;
        }
    }
}

export function mapPeriod(data: ApiPeriod): ThesisReportPeriod {
    return {
        id: data.id,
        name: data.name,
        startDate: formatDate(data.start_date),
        endDate: formatDate(data.end_date),
        status: data.is_active ? "Active" : "Inactive",
        semester: {
            id: data.semester.id,
            name: data.semester.name,
            startDate: formatDate(data.semester.start_date),
            endDate: formatDate(data.semester.end_date),
            status: data.semester.is_active ? "Active" : "Inactive",
            year: {
                id: data.semester.academic_year.id,
                name: data.semester.academic_year.name,
                startDate: formatDate(data.semester.academic_year.start_date),
                endDate: formatDate(data.semester.academic_year.end_date),
                status: data.semester.academic_year.is_active ? "Active" : "Inactive",
            }
        }
    }
}