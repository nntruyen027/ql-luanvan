import api from "@/lib/axios";


export async function getReportRooms() {
    const response = api.get("/api/get-report-room");
    return response;
}

export async function getReportSchedule() {
    const response = api.get("/api/get-report-schedule");
    return response;
}
