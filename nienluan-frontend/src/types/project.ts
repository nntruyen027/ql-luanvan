import {Student, Teacher} from "@/types/user";
import {ThesisReportPeriod} from "@/types/thesisReportPeriod";

export interface Project {
    id: number;
    name: string;
    description?: string;
    students?: Student[];
    supervisor: Teacher;
    period: ThesisReportPeriod;
    status: 'Pending' | 'Approved' | 'Rejected';
    attachments?: string[];
    feedback?: string;
}


export interface Task {
    id: number;
    project: Project;
    title: string;
    description?: string;
    deadline?: string;
    attachments: string[];
    status: 'Doing' | 'Finished' | 'Cancelled';
    review: string;
}