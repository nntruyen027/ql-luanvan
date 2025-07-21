import { Thesis } from "./thesisAndThesisAttachment";

export interface ThesisTask {
    id: number;
    thesis: Thesis;
    title: string;
    description?: string;
    deadline?: string;
    attachments?: string[];
    status: string;
    instructorStatus: string;
    instructorNote?: string;
}


export type ThesisTaskAttachment = {
    id: number;
    thesisTaskId: number;
    filePath: string;
    fileName: string;
};