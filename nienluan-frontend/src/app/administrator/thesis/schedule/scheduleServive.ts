import api from "@/lib/axios";


export async function getAllActiveRooms() {
    const response = api.get("/api/get-active-room");
    return response;
}

export async function getThesisApprovedOptions() {
    const response = api.get("/api/get-thesis-approved-option");
    return response;
}

export async function addThesisReportSchedule(data: any) {
    const response = api.post("/api/add-thesis-report-schedule", data);
    return response;
}

export async function updateThesisReportSchedule(id: number, data: any) {
    const response = api.put(`/api/update-thesis-report-schedule/${id}`, data);
    return response;
}

export async function getSchedule() {
    const response = api.get("/api/get-thesis-schedule");
    return response;
}

export async function deleteSchedule(id: number) {
    const response = api.delete(`/api/delete-thesis-schedule/${id}`);
    return response;
}


