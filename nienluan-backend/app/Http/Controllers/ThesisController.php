<?php

namespace App\Http\Controllers;

use App\Models\ReportPeriod;
use App\Models\Thesis;
use Illuminate\Http\Request;
use App\Models\ThesisAttachment;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ThesisController extends Controller
{
    public function getStudent()
    {
        $students = User::where('role', 'Sinh viên')->get();

        $options = $students->map(function ($student) {
            return [
                'value' => $student->id,
                'label' => $student->name,
            ];
        });
        return response()->json($options, 200);
    }
    public function destroyMulti(Request $request)
    {
        $multiThesis = $request->all();

        foreach ($multiThesis as $thesisId) {
            $thesis = Thesis::with('attachments')->findOrFail($thesisId);

            foreach ($thesis->attachments as $attachment) {
                $fileUrl = $attachment->file_path;
                $filePath = ltrim(str_replace('/storage/', '', $fileUrl), '/');

                if ($filePath && Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }

                $attachment->delete();
            }

            $result = $thesis->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa đề tài thành công!'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 500);
        }
    }
    public function destroy($id)
    {
        $thesis = Thesis::findOrFail($id);

        // Xử lý xóa các file đính kèm
        foreach ($thesis->attachments as $attachment) {
            $fileUrl = $attachment->file_path;

            // Chuyển từ "/storage/theses/abc.docx" => "theses/abc.docx"
            $filePath = ltrim(str_replace('/storage/', '', $fileUrl), '/');

            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            $attachment->delete();
        }


        // Xóa đề tài
        $result = $thesis->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa đề tài thành công!'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 500);
        }
    }
    public function getReportPeriodBySemester($id)
    {
        $reportPeriod = ReportPeriod::where('semester_id', $id)->get();

        return response()->json($reportPeriod);
    }
    public function update(Request $request, $id)
    {
        $thesis = Thesis::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'report_period_id' => 'required|exists:report_periods,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'attachments.*' => 'nullable|file|max:5120|mimes:pdf,doc,docx,zip',
            'deleted_files' => 'nullable|string' // sẽ là JSON string từ FE
        ], [
            'end_date.after_or_equal' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
            'attachments.*.mimes' => 'Chỉ cho phép tải lên các tệp có định dạng: pdf, doc, docx, zip.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật đề tài.',
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cập nhật thông tin đề tài
        $thesis->update([
            'name' => $request->name,
            'description' => $request->description,
            'report_period_id' => $request->report_period_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        // ===== XÓA FILE CŨ nếu có =====
        if ($request->filled('deleted_files')) {
            $deletedFileIds = json_decode($request->deleted_files, true);

            if (is_array($deletedFileIds)) {
                $attachmentsToDelete = ThesisAttachment::whereIn('id', $deletedFileIds)->get();

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
                $path = $file->store('public/theses');
                ThesisAttachment::create([
                    'thesis_id' => $thesis->id,
                    'file_path' => Storage::url($path), // dạng /storage/...
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Đề tài đã được cập nhật thành công.',
            'status' => 'success'
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'report_period_id' => 'required|exists:report_periods,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'attachments.*' => 'nullable|file|max:5120|mimes:pdf,doc,docx,zip',
        ], [
            'end_date.after_or_equal' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
            'attachments.*.mimes' => 'Chỉ cho phép tải lên các tệp có định dạng: pdf, doc, docx, zip.',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm đề tài.',
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tạo đề tài
        $thesis = Thesis::create([
            'name' => $request->name,
            'description' => $request->description,
            'report_period_id' => $request->report_period_id,
            'lecturer_id' => auth()->user()->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        // Lưu các tệp đính kèm nếu có
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('public/theses');
                ThesisAttachment::create([
                    'thesis_id' => $thesis->id,
                    'file_path' => Storage::url($path), // Lưu đường dẫn public
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Đề tài đã được tạo thành công.',
            'status' => 'success'
        ], 201);
    }

    public function getReportPeriodOptions()
    {
        $reportPeriods = ReportPeriod::with('semester.academicYear')
            ->where('is_active', 1)
            ->orderBy('semester_id', 'desc')
            ->orderBy('name')
            ->get();

        $options = $reportPeriods->map(function ($reportPeriod) {
            return [
                'value' => $reportPeriod->id,
                'label' => $reportPeriod->name . ' - ' . $reportPeriod->semester->name . ' - ' . $reportPeriod->semester->academicYear->name,
            ];
        });

        return response()->json($options);
    }

    public function searchThesisPublishForStudent(Request $request)
    {
        $query = Thesis::with([
            'attachments',
            'reportPeriod.semester.academicYear',
            'lecturer',
        ])->doesntHave('registrations');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }


        if ($year = $request->input('year')) {
            $query->whereHas('reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }

        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->where('report_period_id', $reportPeriodId);
        }

        if ($lecturerId = $request->input('lecturer')) {
            $query->whereHas('lecturer', function ($q) use ($lecturerId) {
                $q->where('id', $lecturerId);
            });
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

    public function searchThesisPublish(Request $request)
    {
        $query = Thesis::with([
            'attachments',
            'reportPeriod.semester.academicYear',
            'lecturer',
        ])->doesntHave('registrations')
            ->where('lecturer_id', auth()->user()->id);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }


        if ($year = $request->input('year')) {
            $query->whereHas('reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }

        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->where('report_period_id', $reportPeriodId);
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
    public function thesisPublishForStudent(Request $request)
    {
        $query = Thesis::with([
            'attachments',
            'reportPeriod.semester.academicYear',
            'lecturer',
        ])->doesntHave('registrations');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }


        if ($year = $request->input('year')) {
            $query->whereHas('reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }

        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->where('report_period_id', $reportPeriodId);
        }

        if ($lecturerId = $request->input('lecturer')) {
            $query->whereHas('lecturer', function ($q) use ($lecturerId) {
                $q->where('id', $lecturerId);
            });
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
    public function index(Request $request)
    {
        $query = Thesis::with([
            'attachments',
            'reportPeriod.semester.academicYear',
            'lecturer',
        ])->doesntHave('registrations')
            ->where('lecturer_id', auth()->user()->id);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }


        if ($year = $request->input('year')) {
            $query->whereHas('reportPeriod.semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->whereHas('reportPeriod.semester', function ($q) use ($semesterId) {
                $q->where('id', $semesterId);
            });
        }

        if ($reportPeriodId = $request->input('reportPeriod')) {
            $query->where('report_period_id', $reportPeriodId);
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
}
