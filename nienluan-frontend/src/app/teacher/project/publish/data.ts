import {Project} from "@/types/project";

export const fakeProjects: Project[] = [
    {
        id: 1,
        name: "Ứng dụng AI trong giáo dục",
        students: [
            {
                id: 101,
                fullName: "Nguyễn Văn A",
                username: "nguyenvana",
                email: ""
            },
            {
                id: 102,
                fullName: "Trần Thị B",
                username: "tranthib",
                email: ""
            },
        ],
        supervisor: {
            id: 201,
            fullName: "TS. Lê Văn C",
            username: "levanc",
            email: ""
        },
        period: {
            id: 301,
            name: "Kỳ báo cáo 1",
            semester: {
                id: 401,
                name: "Học kỳ 1",
                year: {
                    id: 501,
                    name: "2024",
                    startDate: "",
                    endDate: "",
                    status: "Active"
                },
                startDate: "",
                endDate: "",
                status: "Active"
            },
            startDate: "",
            endDate: "",
            status: "Active"
        },
        status: "Pending",
    },
    {
        id: 2,
        name: "Nghiên cứu blockchain và ứng dụng",
        students: [
            {
                id: 103,
                fullName: "Phạm Thị D",
                username: "phamthid",
                email: ""
            },
        ],
        supervisor: {
            id: 202,
            fullName: "PGS. TS. Nguyễn Văn E",
            username: "nguyenvane",
            email: ""
        },
        period: {
            id: 302,
            name: "Kỳ báo cáo 2",
            semester: {
                id: 402,
                name: "Học kỳ 2",
                year: {
                    id: 502,
                    name: "2024",
                    startDate: "",
                    endDate: "",
                    status: "Active"
                },
                startDate: "",
                endDate: "",
                status: "Active"
            },
            startDate: "",
            endDate: "",
            status: "Active"
        },
        status: "Approved",
    },
    {
        id: 3,
        name: "Phát triển ứng dụng Mobile với React Native",
        students: [
            {
                id: 104,
                fullName: "Lê Thị F",
                username: "lethif",
                email: ""
            },
            {
                id: 105,
                fullName: "Hoàng Văn G",
                username: "hoangvang",
                email: ""
            },
        ],
        supervisor: {
            id: 201,
            fullName: "TS. Lê Văn C",
            username: "levanc",
            email: ""
        },
        period: {
            id: 303,
            name: "Kỳ báo cáo 3",
            semester: {
                id: 403,
                name: "Học kỳ 3",
                year: {
                    id: 503,
                    name: "2025",
                    startDate: "",
                    endDate: "",
                    status: "Active"
                },
                startDate: "",
                endDate: "",
                status: "Active"
            },
            startDate: "",
            endDate: "",
            status: "Active"
        },
        status: "Rejected",
    },

];
