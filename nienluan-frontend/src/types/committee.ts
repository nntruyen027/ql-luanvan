import { ObjTeacher, ThesisAttachment } from "./thesisAndThesisAttachment";
import { ThesisStudent } from "./thesisRegister";
import { ThesisReportPeriod } from "./thesisReportPeriod";


export interface Committee {
    id: number;
    members: CommitteeMember[];
    thesis: Thesis
}

interface CommitteeMember {
    id: number
    members: Teacher;
    position: string
}

interface Teacher {
    id: number;
    name: string
}

type ThesisRegister = {
    id: number;
    students: ThesisStudent[];
    status: string;
    rejectNote?: string
};


interface Thesis {
    id: number;
    name: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    lecturer: ObjTeacher;
    attachments: ThesisAttachment[];
    reportPeriod: ThesisReportPeriod;
    registrations: ThesisRegister
};