import {Project} from "@/types/project";
import {Committee} from "@/types/committee";
import {Room} from "@/types/room";
import {ThesisReportPeriod} from "@/types/thesisReportPeriod";


export interface Schedule {
    id: number;
    project: Project;
    committee: Committee;
    room: Room;
    startTime: string;
    endTime: string;
    date: string
    thesisReportPeriod: ThesisReportPeriod;
}
