<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Schedule;
use App\Models\Thesis;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    public function getStudentReportSchedule()
    {
        $schedules = Schedule::with([
            'thesis.lecturer',
            'thesis.registrations.students',
            'thesis.council.members.user',
            'room'
        ])
            ->whereHas('thesis.registrations.students', function ($query) {
                $query->where('student_id', auth()->user()->id);
            })
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        $results = [];

        foreach ($schedules as $schedule) {
            $session = ucfirst($schedule->session); // Sáng / Chiều / Tối
            $timeRange = Carbon::parse($schedule->start_time)->format('H:i') . ' - ' . Carbon::parse($schedule->end_time)->format('H:i');
            $date = Carbon::parse($schedule->date)->format('Y-m-d');
            $thesis = $schedule->thesis;

            $lecturer = $thesis->lecturer->name ?? '---';

            $students = $thesis->registrations[0]->students->map(function ($student) {
                return $student->name ?? '---';
            })->toArray();

            $council = $thesis->council ?? null;

            $councilMembers = $council
                ? $council->members->map(function ($m) {
                    return $m->user->name . ' - ' . $m->position;
                })->toArray()
                : [];

            $results[] = [
                'id' => $schedule->id,
                'roomID' => $schedule->room->id,
                'date' => $date,
                'session' => $session,
                'startTime' => $schedule->start_time,
                'endTime' => $schedule->end_time,
                'time' => $timeRange,
                'topicID' => $thesis->id,
                'topic' => $thesis->name,
                'lecturer' => $lecturer,
                'students' => $students,
                'council' => $councilMembers,
            ];
        }

        // Group by session
        $grouped = collect($results)->groupBy('session');

        return response()->json($grouped);
    }
    public function getReportSchedule()
    {
        $schedules = Schedule::with([
            'thesis.lecturer',
            'thesis.registrations.students',
            'thesis.council.members.user',
            'room'
        ])
            ->whereHas('thesis', function ($query) {
                $query->where('lecturer_id', auth()->user()->id);
            })
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        $results = [];

        foreach ($schedules as $schedule) {
            $session = ucfirst($schedule->session); // Sáng / Chiều / Tối
            $timeRange = Carbon::parse($schedule->start_time)->format('H:i') . ' - ' . Carbon::parse($schedule->end_time)->format('H:i');
            $date = Carbon::parse($schedule->date)->format('Y-m-d');
            $thesis = $schedule->thesis;

            $lecturer = $thesis->lecturer->name ?? '---';

            $students = $thesis->registrations[0]->students->map(function ($student) {
                return $student->name ?? '---';
            })->toArray();

            $council = $thesis->council ?? null;

            $councilMembers = $council
                ? $council->members->map(function ($m) {
                    return $m->user->name . ' - ' . $m->position;
                })->toArray()
                : [];

            $results[] = [
                'id' => $schedule->id,
                'roomID' => $schedule->room->id,
                'date' => $date,
                'session' => $session,
                'startTime' => $schedule->start_time,
                'endTime' => $schedule->end_time,
                'time' => $timeRange,
                'topicID' => $thesis->id,
                'topic' => $thesis->name,
                'lecturer' => $lecturer,
                'students' => $students,
                'council' => $councilMembers,
            ];
        }

        // Group by session
        $grouped = collect($results)->groupBy('session');

        return response()->json($grouped);
    }
    public function getStudentReportRoom()
    {
        $rooms = Room::where('is_active', 1)
            ->whereHas('schedules.thesis.registrations.students', function ($query) {
                $query->where('student_id', auth()->user()->id);
            })
            ->get();

        return response()->json($rooms);
    }
    public function getReportRoom()
    {
        $rooms = Room::where('is_active', 1)
            ->whereHas('schedules.thesis', function ($query) {
                $query->where('lecturer_id', auth()->user()->id);
            })
            ->get();

        return response()->json($rooms);
    }
    public function deleteThesisSchedule($id)
    {
        $result = Schedule::where('id', $id)->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa lịch bảo vệ thành công',
            ], 201);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa lịch bảo vệ thất bại',
            ], 400);
        }
    }
    public function getThesisSchedule()
    {
        $schedules = Schedule::with([
            'thesis.lecturer',
            'thesis.registrations.students',
            'thesis.council.members.user',
            'room'
        ])
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        $results = [];

        foreach ($schedules as $schedule) {
            $session = ucfirst($schedule->session); // Sáng / Chiều / Tối
            $timeRange = Carbon::parse($schedule->start_time)->format('H:i') . ' - ' . Carbon::parse($schedule->end_time)->format('H:i');
            $date = Carbon::parse($schedule->date)->format('Y-m-d');
            $thesis = $schedule->thesis;

            $lecturer = $thesis->lecturer->name ?? '---';

            $students = $thesis->registrations[0]->students->map(function ($student) {
                return $student->name ?? '---';
            })->toArray();

            $council = $thesis->council ?? null;

            $councilMembers = $council
                ? $council->members->map(function ($m) {
                    return $m->user->name . ' - ' . $m->position;
                })->toArray()
                : [];

            $results[] = [
                'id' => $schedule->id,
                'roomID' => $schedule->room->id,
                'date' => $date,
                'session' => $session,
                'startTime' => $schedule->start_time,
                'endTime' => $schedule->end_time,
                'time' => $timeRange,
                'topicID' => $thesis->id,
                'topic' => $thesis->name,
                'lecturer' => $lecturer,
                'students' => $students,
                'council' => $councilMembers,
            ];
        }

        // Group by session
        $grouped = collect($results)->groupBy('session');

        return response()->json($grouped);
    }
    public function update($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'scheduleId' => 'required|exists:schedules,id',
            'projectId' => 'required',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ], [
            'scheduleId.required' => 'ID lịch là bắt buộc.',
            'scheduleId.exists' => 'Lịch không tồn tại.',

            'projectId.required' => 'Đề tài là bắt buộc.',
            'date.required' => 'Ngày là bắt buộc.',
            'date.date' => 'Ngày không đúng định dạng.',
            'start_time.required' => 'Thời gian bắt đầu là bắt buộc.',
            'start_time.date_format' => 'Thời gian bắt đầu phải có định dạng HH:mm.',
            'end_time.required' => 'Thời gian kết thúc là bắt buộc.',
            'end_time.date_format' => 'Thời gian kết thúc phải có định dạng HH:mm.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $schedule = Schedule::findOrFail($id);

        // Kiểm tra trùng khung giờ (trừ chính lịch hiện tại)
        $conflict = Schedule::where('room_id', $request->room_id)
            ->where('date', $request->date)
            ->where('id', '!=', $request->scheduleId)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Khung giờ này đã được sử dụng trong cùng một phòng, không thể cập nhật trùng.'
            ], 409); // Conflict
        }

        $startHour = \Carbon\Carbon::parse($request->start_time)->hour;

        $session = 'tối';
        if ($startHour < 12) $session = 'sáng';
        else if ($startHour < 18) $session = 'chiều';

        // Cập nhật lịch
        $schedule->update([
            'thesis_id' => $request->projectId,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'session' => $session,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật lịch bảo vệ thành công',
        ], 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_id' => 'required',
            'thesis_id' => 'required',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ], [
            // room_id
            'room_id.required' => 'Phòng là bắt buộc.',

            // thesis_id
            'thesis_id.required' => 'Đề tài là bắt buộc.',

            // date
            'date.required' => 'Ngày là bắt buộc.',
            'date.date' => 'Ngày không đúng định dạng.',

            // start_time
            'start_time.required' => 'Thời gian bắt đầu là bắt buộc.',
            'start_time.date_format' => 'Thời gian bắt đầu phải có định dạng HH:mm.',

            // end_time
            'end_time.required' => 'Thời gian kết thúc là bắt buộc.',
            'end_time.date_format' => 'Thời gian kết thúc phải có định dạng HH:mm.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        // Kiểm tra trùng khung giờ trong cùng phòng cùng ngày
        $conflict = Schedule::where('room_id', $request->room_id)
            ->where('date', $request->date)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Khung giờ này đã được sử dụng trong cùng một phòng, không thể thêm trùng.'
            ], 409); // Conflict
        }


        $startHour = \Carbon\Carbon::parse($request->start_time)->hour;

        $session = 'tối';
        if ($startHour < 12) $session = 'sáng';
        else if ($startHour < 18) $session = 'chiều';

        // Tạo mới lịch
        $schedule = Schedule::create([
            'room_id' => $request->room_id,
            'thesis_id' => $request->thesis_id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'session' => $session,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo lịch bảo vệ thành công',
        ], 201);
    }

    public function getThesisApproved()
    {
        $thesisOption = Thesis::join(
            'thesis_councils',
            'theses.id',
            '=',
            'thesis_councils.thesis_id'
        )
            ->get();

        return response()->json($thesisOption);
    }
    public function getActiveRoom()
    {
        $rooms = Room::where('is_active', 1)->get();

        return response()->json($rooms);
    }
}
