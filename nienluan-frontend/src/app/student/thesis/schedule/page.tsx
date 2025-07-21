'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import CalendarWeekView from "@/app/administrator/thesis/schedule/CalendarWeekWiew";
import { thesisSchedules } from "@/app/administrator/thesis/schedule/data";
import { Room } from "@/types/room";
import { getReportRooms, getReportSchedule } from "./reportScheduleService";
import { usePermission } from "@/lib/auth";

const ThesisReportSchedule = () => {
    const { hasPermission } = usePermission();
    const [currentWeek, setCurrentWeek] = useState(dayjs());
    const [activeRoomKey, setActiveRoomKey] = useState<string>(String(""));

    const [data, setData] = useState([]);

    const [rooms, setRooms] = useState<Room[]>([]);


    const handlePrevWeek = () => {
        setActiveRoomKey(activeRoomKey);
        setCurrentWeek(currentWeek.subtract(1, "week"));

    };

    const handleNextWeek = () => {
        setActiveRoomKey(activeRoomKey);
        setCurrentWeek(currentWeek.add(1, "week"));

    };

    const handleGotoToday = () => {
        setActiveRoomKey(activeRoomKey);
        setCurrentWeek(dayjs());

    };


    const getRooms = async () => {
        const response = await getReportRooms();
        setRooms(response.data);
        loadData();
    }

    const loadData = async () => {
        const response = await getReportSchedule();
        setData(response.data);
    }


    useEffect(() => {
        getRooms();
    },
        []);

    // Tính toán items
    const items = useMemo(() => {
        return rooms.map((room) => ({
            key: String(room.id),
            label: room.name,
            children: (
                <CalendarWeekView
                    weekStart={currentWeek}
                    schedules={data}
                    room={room}
                />
            ),
        }));
    }, [rooms, data, currentWeek, thesisSchedules]);

    // Đảm bảo activeRoomKey luôn nằm trong rooms
    useEffect(() => {
        if (!rooms.length) return;

        const existingKeys = rooms.map((r) => String(r.id));
        if (!existingKeys.includes(activeRoomKey)) {
            setActiveRoomKey(existingKeys[0]); // fallback về phòng đầu nếu key cũ không còn
        }
    }, [rooms, activeRoomKey]);


    if (!hasPermission('access:thesis-schedule')) {
        window.location.href = "/auth/forbidden";
    }

    return (
        <div className="bg-white p-4 h-fit rounded-md shadow">
            <div className="flex items-center justify-between mb-3">
                <div className="flex gap-3">
                    <Button onClick={handlePrevWeek}>&lt;&lt; Tuần trước</Button>
                    <Button onClick={handleGotoToday}>Hôm nay</Button>
                    <Button onClick={handleNextWeek}>Tuần sau &gt;&gt;</Button>
                </div>
                <div className="text-sm text-gray-600">
                    Tuần bắt đầu:{" "}
                    <strong>{currentWeek.startOf("week").format("DD/MM/YYYY")}</strong>
                </div>
            </div>

            <Tabs
                style={{ height: "100%" }}
                activeKey={activeRoomKey}
                onChange={(key) => setActiveRoomKey(key)}
                items={items}
            />
        </div>
    );
};

export default ThesisReportSchedule;
