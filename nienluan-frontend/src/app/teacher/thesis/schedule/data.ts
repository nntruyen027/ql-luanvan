import {Schedule} from "@/types/schedule";

export const thesisSchedules: Schedule[] = [
    {
        id: 1,
        project: {
            id: 1,
            name: "Ứng dụng AI trong phát hiện sâu răng qua ảnh X-quang",
            description: "Xây dựng mô hình học sâu nhận diện vùng sâu răng",
            students: [
                {
                    id: 1,
                    username: "sv001",
                    fullName: "Nguyễn Văn A",
                    email: "vana@university.edu.vn",
                    phone: "0909123456",
                    major: "Khoa học máy tính"
                }
            ],
            supervisor: {
                id: 11,
                username: "gv01",
                fullName: "TS. Trần Văn B",
                email: "tranvb@university.edu.vn",
                phone: "0912233445",
                major: "Trí tuệ nhân tạo"
            },
            period: {
                id: 301,
                name: "Đợt báo cáo luận văn HK2 2024-2025",
                startDate: "2025-06-01",
                endDate: "2025-06-30",
                semester: {
                    id: 201,
                    name: "HK2 2024-2025",
                    startDate: "2025-01-01",
                    endDate: "2025-06-30",
                    status: "Active",
                    year: {
                        id: 101,
                        name: "Năm học 2024-2025",
                        startDate: "2024-08-01",
                        endDate: "2025-07-31",
                        status: "Active"
                    }
                },
                status: "Active"
            },
            status: "Approved",
            attachments: ["ai_dental.pdf"],
            feedback: "Tốt, có thể áp dụng thực tế."
        },
        committee: {
            id: 501,
            title: "Hội đồng AI nâng cao",
            description: "Hội đồng chấm các đề tài về AI ứng dụng",
            supervisor: {
                id: 12,
                username: "gv02",
                fullName: "PGS. TS. Lê Thị C",
                email: "lethic@university.edu.vn",
                phone: "0912345678",
                major: "Học máy"
            },
            period: {
                id: 301,
                name: "Đợt báo cáo luận văn HK2 2024-2025",
                startDate: "2025-06-01",
                endDate: "2025-06-30",
                semester: {
                    id: 201,
                    name: "HK2 2024-2025",
                    startDate: "2025-01-01",
                    endDate: "2025-06-30",
                    status: "Active",
                    year: {
                        id: 101,
                        name: "Năm học 2024-2025",
                        startDate: "2024-08-01",
                        endDate: "2025-07-31",
                        status: "Active"
                    }
                },
                status: "Active"
            },
            committee: [
                {
                    id: 1,
                    teacher: {
                        id: 13,
                        username: "gv03",
                        fullName: "TS. Phạm Văn D",
                        email: "phamvd@university.edu.vn",
                        phone: "0988123456",
                        major: "AI"
                    },
                    role: "Chủ tịch"
                },
                {
                    id: 2,
                    teacher: {
                        id: 14,
                        username: "gv04",
                        fullName: "ThS. Võ Thị E",
                        email: "vothe@university.edu.vn",
                        phone: "0933445566",
                        major: "Xử lý ảnh"
                    },
                    role: "Thư ký"
                },
                {
                    id: 3,
                    teacher: {
                        id: 15,
                        username: "gv05",
                        fullName: "TS. Trịnh Văn F",
                        email: "trinhvf@university.edu.vn",
                        phone: "0977888999",
                        major: "Y sinh học"
                    },
                    role: "Ủy viên"
                }
            ],
            attachments: ["committee_501_notes.pdf"],
            feedback: "Nên bổ sung thêm hình ảnh minh họa"
        },
        room: {
            id: 1,
            name: "Phòng Bảo vệ 101",
            description: "Tầng 1, khu nhà A",
            status: "Active",
        },
        startTime: "09:00",
        endTime: "10:00",
        date: "2025-06-06",
        thesisReportPeriod: {
            id: 301,
            name: "Đợt báo cáo luận văn HK2 2024-2025",
            startDate: "2025-06-01",
            endDate: "2025-06-30",
            semester: {
                id: 201,
                name: "HK2 2024-2025",
                startDate: "2025-01-01",
                endDate: "2025-06-30",
                status: "Active",
                year: {
                    id: 101,
                    name: "Năm học 2024-2025",
                    startDate: "2024-08-01",
                    endDate: "2025-07-31",
                    status: "Active"
                }
            },
            status: "Active"
        }
    }
];
