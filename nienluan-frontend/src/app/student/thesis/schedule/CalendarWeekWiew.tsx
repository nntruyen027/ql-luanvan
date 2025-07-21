import React from "react";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import {Room} from "@/types/room";
import {Schedule} from "@/types/schedule";

dayjs.locale('vi');

const getWeekDates = (startDate: dayjs.Dayjs) => {
    const startOfWeek = startDate.startOf("week");
    return Array.from({length: 7}, (_, i) => startOfWeek.add(i, "day"));
};

type Props = {
    onClickDate: (date: string, schedules: Schedule[]) => void;
    weekStart: dayjs.Dayjs;
    room: Room;
    schedules: Schedule[];
};

const CalendarWeekView = ({onClickDate, weekStart, room, schedules}: Props) => {
    const weekDates = getWeekDates(weekStart);
    const today = dayjs().format("DD-MM-YYYY");

    return (
        <div className="grid grid-cols-7 gap-2 mt-3 h-[50vh]">
            {weekDates.map((date) => {
                const formattedDate = date.format("YYYY-MM-DD");
                const isToday = date.format("DD-MM-YYYY") === today;

                const daySchedules = schedules.filter(
                    s => s.date === formattedDate && s.room.id === room.id
                );

                return (
                    <div
                        key={formattedDate}
                        className={`border p-2 rounded h-full cursor-pointer text-center hover:bg-blue-50 transition overflow-y-auto
                            ${isToday ? 'bg-blue-100 border-blue-500 text-blue-800 font-bold' : ''}
                        `}
                        onClick={() => onClickDate(date.format("DD-MM-YYYY"), daySchedules)}
                    >
                        <div className="font-semibold first-letter:uppercase">{date.format("dddd")}</div>
                        <div>{date.format("DD/MM")}</div>
                        {isToday && <div className="text-xs mt-1 italic">Hôm nay</div>}

                        {daySchedules.length > 0 && (
                            <div className="mt-2 text-left space-y-2">
                                {daySchedules.map(schedule => (
                                    <div key={schedule.id} className="bg-gray-100 p-1 rounded text-sm">
                                        <div className="font-semibold text-blue-700">
                                            {schedule.startTime} - {schedule.endTime}
                                        </div>
                                        <div className="truncate font-medium">{schedule.project.name}</div>
                                        <div className="text-xs text-gray-600">
                                            {schedule.project.students?.map(s => s.fullName).join(", ")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarWeekView;
