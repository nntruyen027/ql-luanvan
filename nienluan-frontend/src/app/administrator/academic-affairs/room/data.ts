import {Room} from "@/types/room";

export const initialData: Room[] = [
    {
        id: 1,
        name: "Phòng Bảo vệ 101",
        description: "Tầng 1, khu nhà A",
        status: "Active",
    },
    {
        id: 2,
        name: "Phòng Bảo vệ 202",
        description: "Tầng 2, khu nhà B",
        status: "Active",
    },
    {
        id: 3,
        name: "Phòng Họp Chuyên đề",
        description: "Khu nghiên cứu số 3",
        status: "Inactive",
    },
    {
        id: 4,
        name: "Phòng Lab 404",
        description: "Tầng 4, nhà C - phòng thí nghiệm",
        status: "Active",
    },
    {
        id: 5,
        name: "Phòng Hội đồng 505",
        status: "Inactive",
    },
];
