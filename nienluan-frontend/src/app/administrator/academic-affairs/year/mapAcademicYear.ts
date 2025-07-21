import { AcademicYear } from "@/types/academicYear";
import { formatDate } from "@/lib/utils";

interface ApiAcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export function mapAcademicYear(data: ApiAcademicYear): AcademicYear {
    return {
        id: data.id,
        name: data.name,
        startDate: formatDate(data.start_date),
        endDate: formatDate(data.end_date),
        status: data.is_active ? "Active" : "Inactive",
    };
}
