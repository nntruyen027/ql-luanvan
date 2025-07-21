<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\ThesisRegistration;
use App\Models\ThesisTask;
use App\Models\ThesisTaskAttachment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ThesisTaskController extends Controller
{
    public function reviewThesisTask($id, Request $request)
    {
        //Validate đầu vào kèm thông báo lỗi tiếng Việt
        $validated = $request->validate([
            'instructor_status'    => 'required|in:passed,failed',
            'instructor_note' => 'nullable|string'
        ], [
            'instructor_status.required' => 'Vui lòng đánh giá đạt/không đạt.',
            'instructor_status.in' => 'Trạng thái đánh giá không hợp lệ.',
            'instructor_note.string' => 'Ghi chú phải là chuỗi ký tự.'
        ]);

        //Tìm công việc cần cập nhật
        $task = ThesisTask::find($id);
        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Công việc không tồn tại.'
            ], 404);
        }

        //Cập nhật công việc
        $task->update($validated);

        if ($task) {
            return response()->json([
                'status' => 'success',
                'message' => 'Đánh giá công việc thành công.'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Đánh giá công việc thất bại. Vui lòng kiểm tra lại.'
            ], 400);
        }
    }
    public function deleteMultiThesisTask(Request $request)
    {
        $multiTask = $request->all();

        foreach ($multiTask as $task) {
            $task = ThesisTask::where('id', $task);
            $result = $task->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa công việc thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
    public function deleteThesisTask($id)
    {
        $result = ThesisTask::where('id', $id)->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa công việc thành công.'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa công việc thất bại.'
            ], 400);
        }
    }
    public function searchThesisTaskForStudent(Request $request)
    {
        $userId = auth()->user()->id;
        $query = ThesisTask::with([
            'attachments',
            'thesis.reportPeriod.semester.academicYear',
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.registrations.students'
        ])->whereHas('thesis.registrations.students', function ($query) use ($userId) {
            $query->where('student_id', $userId);
        });


        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($year = $request->input('year')) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        if ($thesisId = $request->input('thesis')) {
            $query->where('thesis_id', $thesisId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = $request->input('per_page', 10);

        $theses = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $theses->items(),
            'total' => $theses->total(),
            'page' => $theses->currentPage(),
            'per_page' => $theses->perPage(),
        ]);
    }
    public function searchThesisTask(Request $request)
    {
        $userId = auth()->user()->id;
        $query = ThesisTask::with([
            'thesis.reportPeriod.semester.academicYear',
            'thesis.lecturer',
            'thesis.attachments',
        ])->whereHas('thesis.lecturer', function ($query) use ($userId) {
            $query->where('id', $userId);
        });


        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($year = $request->input('year')) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        if ($thesisId = $request->input('thesis')) {
            $query->where('thesis_id', $thesisId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = $request->input('per_page', 10);

        $theses = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $theses->items(),
            'total' => $theses->total(),
            'page' => $theses->currentPage(),
            'per_page' => $theses->perPage(),
        ]);
    }

    public function getThesisTaskForStudent(Request $request)
    {
        $userId = auth()->user()->id;
        $query = ThesisTask::with([
            'attachments',
            'thesis.reportPeriod.semester.academicYear',
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.registrations.students'
        ])->whereHas('thesis.registrations.students', function ($query) use ($userId) {
            $query->where('student_id', $userId);
        });


        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($year = $request->input('year')) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        if ($thesisId = $request->input('thesis')) {
            $query->where('thesis_id', $thesisId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = $request->input('per_page', 10);

        $theses = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $theses->items(),
            'total' => $theses->total(),
            'page' => $theses->currentPage(),
            'per_page' => $theses->perPage(),
        ]);
    }
    public function getThesisTask(Request $request)
    {
        $userId = auth()->user()->id;
        $query = ThesisTask::with([
            'thesis.reportPeriod.semester.academicYear',
            'thesis.lecturer',
            'thesis.attachments',
        ])->whereHas('thesis.lecturer', function ($query) use ($userId) {
            $query->where('id', $userId);
        });


        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($year = $request->input('year')) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        if ($thesisId = $request->input('thesis')) {
            $query->where('thesis_id', $thesisId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = $request->input('per_page', 10);

        $theses = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $theses->items(),
            'total' => $theses->total(),
            'page' => $theses->currentPage(),
            'per_page' => $theses->perPage(),
        ]);
    }
    public function studentUpdateThesisTask(Request $request, $id)
    {

        //Validate đầu vào kèm thông báo lỗi tiếng Việt
        $validator = Validator::make($request->all(), [
            'status'    => 'required|in:notstarted,doing,finished,cancelled',
            'attachments.*' => 'nullable|file|max:5120|mimes:pdf,doc,docx,zip',
            'deleted_files' => 'nullable|string' // sẽ là JSON string từ FE
        ], [
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'attachments.*.mimes' => 'Chỉ cho phép tải lên các tệp có định dạng: pdf, doc, docx, zip.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật đề tài.',
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }


        //Tìm công việc cần cập nhật
        $task = ThesisTask::find($id);
        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Công việc không tồn tại.'
            ], 404);
        }

        // Cập nhật thông tin đề tài
        $task->update([
            'status' => $request->status
        ]);

        // ===== XÓA FILE CŨ nếu có =====
        if ($request->filled('deleted_files')) {
            $deletedFileIds = json_decode($request->deleted_files, true);

            if (is_array($deletedFileIds)) {
                $attachmentsToDelete = ThesisTaskAttachment::whereIn('id', $deletedFileIds)->get();

                foreach ($attachmentsToDelete as $attachment) {
                    // Xóa file vật lý
                    $storagePath = str_replace('/storage/', 'public/', $attachment->file_path);
                    if (Storage::exists($storagePath)) {
                        Storage::delete($storagePath);
                    }

                    // Xóa bản ghi DB
                    $attachment->delete();
                }
            }
        }

        // ===== THÊM FILE MỚI nếu có =====
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('public/thesisTask');
                ThesisTaskAttachment::create([
                    'thesis_task_id' => $id,
                    'file_path' => Storage::url($path), // dạng /storage/...
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Công việc đã được cập nhật thành công.',
            'status' => 'success'
        ], 200);
    }
    public function updateThesisTask(Request $request, $id)
    {
        //Validate đầu vào kèm thông báo lỗi tiếng Việt
        $validated = $request->validate([
            'thesis_id' => 'required|exists:theses,id',
            'title'     => 'required|string|max:255',
            'deadline'  => 'required|date',
            'status'    => 'required|in:notstarted,doing,finished,cancelled',
            'description' => 'nullable|string'
        ], [
            'thesis_id.required' => 'Vui lòng chọn đề tài.',
            'thesis_id.exists' => 'Đề tài không tồn tại.',
            'title.required' => 'Vui lòng nhập tên công việc.',
            'title.string' => 'Tên công việc phải là chuỗi ký tự.',
            'title.max' => 'Tên công việc không được vượt quá 255 ký tự.',
            'deadline.required' => 'Vui lòng chọn hạn chót.',
            'deadline.date' => 'Hạn chót phải là ngày hợp lệ.',
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'description.string' => 'Mô tả phải là chuỗi ký tự.'
        ]);

        //Tìm công việc cần cập nhật
        $task = ThesisTask::find($id);
        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Công việc không tồn tại.'
            ], 404);
        }

        //Lấy thông tin học kỳ liên kết với đề tài
        $thesis = Thesis::with('reportPeriod')->where('id', $validated['thesis_id'])->first();
        $reportPeriod = $thesis->reportPeriod;

        if (!$reportPeriod) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đề tài chưa được gắn với kỳ báo cáo.'
            ], 422);
        }

        $deadline = Carbon::parse($validated['deadline']);
        $startDate = Carbon::parse($reportPeriod->start_date);
        $endDate = Carbon::parse($reportPeriod->end_date);

        //Kiểm tra hạn chót có nằm trong học kỳ không
        if ($deadline->lt($startDate) || $deadline->gt($endDate)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hạn chót phải nằm trong khoảng thời gian của kỳ báo cáo (' . $startDate->toDateString() . ' đến ' . $endDate->toDateString() . ').'
            ], 422);
        }

        //Cập nhật công việc
        $task->update($validated);

        if ($task) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật công việc cho đề tài thành công.'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Cập nhật công việc cho đề tài thất bại. Vui lòng kiểm tra lại.'
            ], 400);
        }
    }

    public function addThesisTask(Request $request)
    {
        //Validate đầu vào kèm thông báo lỗi tiếng Việt
        $validated = $request->validate([
            'thesis_id' => 'required|exists:theses,id',
            'title'     => 'required|string|max:255',
            'deadline'  => 'required|date',
            'status'    => 'required|in:notstarted,doing,finished,cancelled',
            'description' => 'nullable|string'
        ], [
            'thesis_id.required' => 'Vui lòng chọn đề tài.',
            'thesis_id.exists' => 'Đề tài không tồn tại.',
            'title.required' => 'Vui lòng nhập tên công việc.',
            'title.string' => 'Tên công việc phải là chuỗi ký tự.',
            'title.max' => 'Tên công việc không được vượt quá 255 ký tự.',
            'deadline.required' => 'Vui lòng chọn hạn chót.',
            'deadline.date' => 'Hạn chót phải là ngày hợp lệ.',
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'description.string' => 'Mô tả phải là chuỗi ký tự.'
        ]);

        //Lấy thông tin học kỳ liên kết với đề tài
        $thesis = Thesis::with('reportPeriod')->where('id', ($validated['thesis_id']))->first();
        $reportPeriod = $thesis->reportPeriod;

        if (!$reportPeriod) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đề tài chưa được gắn với kỳ báo cáo.'
            ], 422);
        }

        $deadline = Carbon::parse($validated['deadline']);
        $startDate = Carbon::parse($reportPeriod->start_date);
        $endDate = Carbon::parse($reportPeriod->end_date);

        //Kiểm tra hạn chót có nằm trong học kỳ không
        if ($deadline->lt($startDate) || $deadline->gt($endDate)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hạn chót phải nằm trong khoảng thời gian của kỳ báo cáo (' . $startDate->toDateString() . ' đến ' . $endDate->toDateString() . ').'
            ], 422);
        }

        //Lưu công việc đề tài
        $task = ThesisTask::create($validated);

        if ($task) {
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm công việc cho đề tài thành công.'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Thêm công việc cho đề tài thất bại. Vui lòng kiểm tra lại.'
            ], 400);
        }
    }

    public function thesisTaskByTimeForStudent(Request $request)
    {
        $userId = auth()->user()->id;
        $query = ThesisRegistration::with([
            'thesis.reportPeriod.semester.academicYear',
        ])->whereHas('students', function ($query) use ($userId) {
            $query->where('student_id', $userId);
        });

        if ($year = $request->year) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->semester) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->reportPeriod) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        $result = $query->get();

        return response()->json($result);
    }

    public function thesisTaskByTime(Request $request)
    {
        $userId = auth()->user()->id;
        $query = ThesisRegistration::with([
            'thesis.reportPeriod.semester.academicYear',
        ])->whereHas('thesis', function ($query) use ($userId) {
            $query->where('lecturer_id', $userId);
        });

        if ($year = $request->year) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->semester) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->reportPeriod) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        $result = $query->get();

        return response()->json($result);
    }

    public function thesisTaskActiveByTimeForStudent(Request $request)
    {
        $userId = auth()->user()->id;

        $query = ThesisRegistration::with([
            'thesis.reportPeriod.semester.academicYear',
            'thesis.lecturer',
            'students'
        ])->whereHas('students', function ($query) use ($userId) {
            $query->where('student_id', $userId);
        });

        if ($year = $request->year) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->semester) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->reportPeriod) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        $result = $query->get();

        return response()->json($result);
    }


    public function thesisTaskActiveByTime(Request $request)
    {
        $query = ThesisRegistration::with([
            'thesis.reportPeriod.semester.academicYear',
            'thesis.lecturer',
            'students'
        ])->where('status', 'approved');

        if ($year = $request->year) {
            $query->whereHas('thesis.reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->semester) {
            $query->whereHas('thesis.reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }


        if ($reportPeriodId = $request->reportPeriod) {
            $query->whereHas('thesis.reportPeriod', function ($q) use ($reportPeriodId) {
                $q->where('id', $reportPeriodId);
            });
        }

        $result = $query->get();

        return response()->json($result);
    }
}
