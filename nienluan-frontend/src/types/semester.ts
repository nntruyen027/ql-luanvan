import {AcademicYear} from "@/types/academicYear";

export type Semester = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Inactive';
    year?: AcademicYear;
};
