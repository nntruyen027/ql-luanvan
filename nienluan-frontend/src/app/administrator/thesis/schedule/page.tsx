'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Button, Tabs } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CalendarWeekView from "@/app/administrator/thesis/schedule/CalendarWeekWiew";
import { thesisSchedules } from "@/app/administrator/thesis/schedule/data";
import ScheduleModal from "./ScheduleModal";
import { addThesisReportSchedule, deleteSchedule, getAllActiveRooms, getSchedule, getThesisApprovedOptions, updateThesisReportSchedule } from "./scheduleServive";
import { Room } from "@/types/room";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/noti/slice";
import { toast } from "react-toastify";
import { usePermission } from "@/lib/auth";

const Page = () => {
    const { hasPermission } = usePermission();
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(dayjs());
    const [activeRoomKey, setActiveRoomKey] = useState<string>(String(""));


    const [data, setData] = useState([]);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [thesis, setThesis] = useState([]);

    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);


    const handleDateClick = (date: any) => {
        setSelectedDate(date);
        setModalVisible(true);
    };

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

    const handleDeleteSchedule = async (id: number) => {
        try {
            setLoadingId(id);
            const response = await deleteSchedule(id);
            const responseData = { message: response.data.message, type: response.data.status };
            if (responseData.type === 'success') {
                dispatch(showNotification(responseData));
                toast.success(responseData.message, {
                    position: "top-right"
                });
                loadData();
                setLoadingId(null);
            }
            else {
                setLoadingId(null);
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }
            setModalVisible(false);
        } catch (error: any) {
            setLoadingId(null);
            const errors = error.response.data.errors;
            if (errors || errors != undefined) {
                Object.values(errors).forEach((fieldErrors: any) => {
                    fieldErrors.forEach((msg: string) => {
                        toast.error(msg, {
                            position: 'top-right',
                        });
                    });
                });
            }
            else {
                const responseData = { message: error.response.data.message, type: error.response.data.status };
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }

        }
    }

    const handleScheduleUpdate = async (values: {
        date: Dayjs;
        startTime: Dayjs;
        endTime: Dayjs;
        projectId: number;
        scheduleId: number;
    }) => {
        try {
            setLoadingAdd(true);
            const response = await updateThesisReportSchedule(values.scheduleId, values);
            const responseData = { message: response.data.message, type: response.data.status };
            if (responseData.type === 'success') {
                dispatch(showNotification(responseData));
                toast.success(responseData.message, {
                    position: "top-right"
                });
                setLoadingAdd(false);
                loadData();
            }
            else {
                setLoadingAdd(false);
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }
            setModalVisible(false);
        } catch (error: any) {
            setLoadingAdd(false);
            const errors = error.response.data.errors;
            if (errors || errors != undefined) {
                Object.values(errors).forEach((fieldErrors: any) => {
                    fieldErrors.forEach((msg: string) => {
                        toast.error(msg, {
                            position: 'top-right',
                        });
                    });
                });
            }
            else {
                const responseData = { message: error.response.data.message, type: error.response.data.status };
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }

        }
    };

    const handleScheduleSubmit = async (values: {
        date: Dayjs;
        startTime: Dayjs;
        endTime: Dayjs;
        roomId: number;
        projectId: number;
    }) => {
        try {
            setLoadingAdd(true);
            const response = await addThesisReportSchedule(values);
            const responseData = { message: response.data.message, type: response.data.status };
            if (responseData.type === 'success') {
                dispatch(showNotification(responseData));
                toast.success(responseData.message, {
                    position: "top-right"
                });
                setLoadingAdd(false);
                loadData();
            }
            else {
                setLoadingAdd(false);
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }
            setModalVisible(false);
        } catch (error: any) {
            setLoadingAdd(false);
            const errors = error.response.data.errors;
            if (errors || errors != undefined) {
                Object.values(errors).forEach((fieldErrors: any) => {
                    fieldErrors.forEach((msg: string) => {
                        toast.error(msg, {
                            position: 'top-right',
                        });
                    });
                });
            }
            else {
                const responseData = { message: error.response.data.message, type: error.response.data.status };
                dispatch(showNotification(responseData));
                toast.error(responseData.message, {
                    position: "top-right"
                });
            }

        }
    };

    const getRooms = async () => {
        const response = await getAllActiveRooms();
        setRooms(response.data);
        loadData();
    }

    const loadData = async () => {
        const response = await getSchedule();
        setData(response.data);
    }

    const getThesisApproved = async () => {
        const response = await getThesisApprovedOptions();
        setThesis(response.data);
    }

    useEffect(() => {
        getRooms();
        getThesisApproved();
    },
        []);

    // Tính toán items
    const items = useMemo(() => {
        return rooms.map((room) => ({
            key: String(room.id),
            label: room.name,
            children: (
                <CalendarWeekView
                    onClickDate={handleDateClick}
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


    const activeRoom = rooms.find((room) => String(room.id) === activeRoomKey);

    const schedulesInDay = thesisSchedules.filter((schedule) => {
        return (
            activeRoom &&
            schedule.room.id === activeRoom.id &&
            selectedDate &&
            dayjs(schedule.date).isSame(selectedDate, 'day')
        );
    });

    if (!hasPermission('access:defense-schedule')) {
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

            {selectedDate && activeRoom && hasPermission('add:defense-schedule')
                && hasPermission('edit:defense-schedule') && (
                    <ScheduleModal
                        open={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSubmit={handleScheduleSubmit}
                        onUpdate={handleScheduleUpdate}
                        onDelete={handleDeleteSchedule}
                        thesis={thesis}
                        selectedDate={selectedDate}
                        room={activeRoom}
                        schedulesInDay={schedulesInDay}
                        weekStart={currentWeek}
                        schedules={data}
                        rooms={rooms}
                        loadingAdd={loadingAdd}
                        loadingId={loadingId}
                    />
                )}
        </div>
    );
};

export default Page;
