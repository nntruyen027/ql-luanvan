import { Thesis } from "./thesisAndThesisAttachment";

export type ObjStudent = {
    id: number;
    name: string
}

export type ThesisStudent = {
    id: number;
    student?: ObjStudent
};


export type ThesisRegister = {
    id: number;
    thesis: Thesis;
    student: ThesisStudent[];
    status: string;
    rejectNote?: string
};



