import {Committee} from "@/types/committee";

export const fakeCommitees: Committee[] = [
    {
        id: 1,
        title: "Ứng dụng AI trong giáo dục",
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
        committee: [
            {
                id: 1,
                teacher: {
                    id: 101,
                    fullName: "Nguyễn Văn A",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Chủ tịch'
            },
            {
                id: 2,
                teacher: {
                    id: 102,
                    fullName: "Nguyễn Văn B",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Thư ký'
            },
            {
                id: 3,
                teacher: {
                    id: 104,
                    fullName: "Nguyễn Văn C",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Ủy viên'
            }
        ],
    },
    {
        id: 2,
        title: "Nghiên cứu blockchain và ứng dụng",
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
        committee: [
            {
                id: 1,
                teacher: {
                    id: 101,
                    fullName: "Nguyễn Văn A",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Chủ tịch'
            },
            {
                id: 2,
                teacher: {
                    id: 102,
                    fullName: "Nguyễn Văn B",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Thư ký'
            },
            {
                id: 3,
                teacher: {
                    id: 104,
                    fullName: "Nguyễn Văn C",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Ủy viên'
            }
        ],
    },
    {
        id: 3,
        title: "Phát triển ứng dụng Mobile với React Native",
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
        committee: [
            {
                id: 1,
                teacher: {
                    id: 101,
                    fullName: "Nguyễn Văn A",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Chủ tịch'
            },
            {
                id: 2,
                teacher: {
                    id: 102,
                    fullName: "Nguyễn Văn B",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Thư ký'
            },
            {
                id: 3,
                teacher: {
                    id: 104,
                    fullName: "Nguyễn Văn C",
                    username: "nguyenvana",
                    email: ""
                },
                role: 'Ủy viên'
            }
        ],
    },
];
