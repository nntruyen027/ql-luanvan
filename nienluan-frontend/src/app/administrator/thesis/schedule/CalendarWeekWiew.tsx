import React from "react";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import { Room } from "@/types/room";
import { Schedule } from "@/types/schedule";
import {
    ClockCircleOutlined,
    FileTextOutlined,
    UserSwitchOutlined,
    UserOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Tooltip } from "antd";

dayjs.locale('vi');

const getWeekDates = (startDate: dayjs.Dayjs) => {
    const startOfWeek = startDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
};

type GroupedSchedules = {
    [session: string]: Schedule[];
};

type Props = {
    onClickDate: (date: string, schedules: Schedule[]) => void;
    weekStart: dayjs.Dayjs;
    room: Room;
    schedules: GroupedSchedules;
};

const CalendarWeekView = ({ onClickDate, weekStart, room, schedules }: Props) => {
    const weekDates = getWeekDates(weekStart);
    const today = dayjs().format("DD-MM-YYYY");
    const sessions = ['Sáng', 'Chiều', 'Tối'];

    return (
        <div className="grid grid-cols-7 grid-rows-2 gap-2 mt-3 h-[80vh]">
            {weekDates.map((date) => {
                const formattedDate = date.format("YYYY-MM-DD");
                const isToday = date.format("DD-MM-YYYY") === today;

                // Gom tất cả schedules theo ngày & phòng
                const allSchedulesForDate = sessions.flatMap(session =>
                    (schedules[session] || []).filter(
                        s => s.date === formattedDate && s.roomID === room.id
                    )
                );

                // Group lại theo session để hiển thị
                const groupedBySession = sessions.reduce((acc, session) => {
                    acc[session] = (schedules[session] || []).filter(
                        s => s.date === formattedDate && s.roomID === room.id
                    );
                    return acc;
                }, {} as GroupedSchedules);

                return (
                    <div
                        key={formattedDate}
                        className={`border rounded h-full flex flex-col cursor-pointer
              ${isToday ? 'bg-blue-100 border-blue-500 text-blue-800 font-bold' : ''}
            `}
                        onClick={() => onClickDate(date.format("YYYY-MM-DD"), allSchedulesForDate)}
                    >
                        {/* Header ngày */}
                        <div className="sticky top-0 z-10 bg-white border-b p-2 shadow-sm text-center text-[12px] min-h-[60px] flex flex-col items-center justify-center">
                            <div className="font-semibold first-letter:uppercase">{date.format("dddd")}</div>
                            <div>{date.format("DD/MM")}</div>
                            <div className={`${isToday ? 'text-xs mt-1 italic' : 'invisible text-xs mt-1 italic'}`}>
                                Hôm nay
                            </div>
                        </div>


                        {/* Nội dung */}
                        <div className="overflow-y-auto p-2 space-y-2 flex-1 text-[11px]">
                            {sessions.map(session => (
                                groupedBySession[session]?.length > 0 && (
                                    <div key={session}>
                                        <div className="text-[12px] text-black-500 font-semibold mb-1">{session}:</div>
                                        <div className="space-y-1">
                                            {groupedBySession[session].map((schedule, index) => (
                                                <Tooltip
                                                    key={schedule.id || `${session}-${schedule.date}-${index}`}
                                                    title={
                                                        <div className="text-xs space-y-1 max-w-[300px]">
                                                            <div>
                                                                <FileTextOutlined className="mr-1" />
                                                                <strong>Đề tài:</strong> {schedule.topic}
                                                            </div>
                                                            <div>
                                                                <UserSwitchOutlined className="mr-1" />
                                                                <strong>GVHD:</strong> {schedule.lecturer}
                                                            </div>
                                                            <div>
                                                                <UserOutlined className="mr-1" />
                                                                <strong>Sinh viên:</strong> {schedule.students?.join(', ')}
                                                            </div>
                                                            {schedule.council?.length > 0 && (
                                                                <div>
                                                                    <TeamOutlined className="mr-1" />
                                                                    <strong>Hội đồng:</strong> {schedule.council.join(', ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    overlayStyle={{ maxWidth: 350 }}
                                                >
                                                    <div className="bg-gray-100 p-1 rounded leading-tight space-y-1 hover:bg-gray-200">
                                                        <div className="flex items-center gap-1 text-blue-700 font-semibold">
                                                            <ClockCircleOutlined className="text-[12px]" />
                                                            {schedule.time}
                                                        </div>
                                                        <div className="line-clamp-2 text-gray-800">{schedule.topic}</div>
                                                    </div>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarWeekView;
