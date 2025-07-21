import {Semester} from "@/types/semester";

export interface ThesisReportPeriod {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    semester: Semester;
    status: 'Active' | 'Inactive';
}
