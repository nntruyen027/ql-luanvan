import { Semester } from "@/types/semester";
import { formatDate } from "@/lib/utils";

interface ApiSemester {
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
    };
}

export function mapSemester(data: ApiSemester): Semester {
    return {
        id: data.id,
        name: data.name,
        startDate: formatDate(data.start_date),
        endDate: formatDate(data.end_date),
        status: data.is_active ? "Active" : "Inactive",
        year: {
            id: data.academic_year.id,
            name: data.academic_year.name,
            startDate: formatDate(data.academic_year.start_date),
            endDate: formatDate(data.academic_year.end_date),
            status: data.academic_year.is_active ? "Active" : "Inactive",
        },
    };
}
