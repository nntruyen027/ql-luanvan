import type { ThesisReportPeriod } from "./thesisReportPeriod";

export type ObjTeacher = {
    id: number;
    name: string;
    email: string;
    phone_number: string
}

export type ThesisAttachment = {
    id: number;
    thesisId: number;
    filePath: string;
    fileName: string;
};

export type Thesis = {
    id: number;
    name: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    lecturer: ObjTeacher;
    attachments: ThesisAttachment[];
    reportPeriod: ThesisReportPeriod;
};
