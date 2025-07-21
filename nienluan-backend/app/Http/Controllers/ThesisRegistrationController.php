<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\ThesisRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThesisRegistrationController extends Controller
{

    public function approveMulti(Request $request)
    {
        $multiThesis = $request->all();

        foreach ($multiThesis as $thesis) {
            $thesis = ThesisRegistration::where('id', $thesis);
            $result = $thesis->update([
                'status' => 'approved'
            ]);
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Phê duyệt đề tài thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Phê duyệt đề tài thất bại, vui lòng kiểm tra lại!'
            ], 400);
        }
    }
    public function rejectMulti(Request $request)
    {
        $multiThesis = $request->all();

        foreach ($multiThesis as $thesis) {
            $thesis = ThesisRegistration::where('id', $thesis);
            $result = $thesis->update([
                'status' => 'rejected'
            ]);
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Từ chối đề tài thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Từ chối đề tài thất bại, vui lòng kiểm tra lại!'
            ], 400);
        }
    }
    public function withdrawThesis($id)
    {
        $thesis = ThesisRegistration::where('id', $id)->first();

        if ($thesis) {
            $thesisStudentDeleted = DB::table('thesis_registration_student')
                ->where('thesis_registration_id', $thesis->id)
                ->delete();
            if ($thesisStudentDeleted) {
                $thesisRegistrationDeleted = $thesis->delete();

                if ($thesisRegistrationDeleted) {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Rút đề tài về chỉnh sửa thành công'
                    ], 201);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Rút đề tài thất bại, vui lòng kiểm tra lại!'
                    ], 400);
                }
            }
        }
    }
    public function approveThesis($id)
    {
        $thesis = ThesisRegistration::where('thesis_id', $id)->first();

        $result = $thesis->update([
            'status' => 'approved'
        ]);

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Phê duyệt đề tài thành công'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Phê duyệt đề tài thất bại, vui lòng kiểm tra lại!'
            ], 400);
        }
    }
    public function rejectThesis($id, Request $request)
    {
        $thesis = ThesisRegistration::where('thesis_id', $id)->first();

        $result = $thesis->update([
            'status' => 'rejected',
            'reject_note' => $request->reject_note
        ]);

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Từ chối đề tài thành công'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Từ chối đề tài thất bại, vui lòng kiểm tra lại!'
            ], 400);
        }
    }
    public function getLecturerOptions()
    {
        $lecturer = User::where('role', 'Giảng viên')->get();
        return response()->json($lecturer);
    }

    public function searchThesisRegister(Request $request)
    {
        $query = ThesisRegistration::with([
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.reportPeriod.semester.academicYear',
            'students'
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('thesis', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('students', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('thesis.lecturer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
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

        if ($lecturerId = $request->input('lecturer')) {
            $query->whereHas('thesis.lecturer', function ($q4) use ($lecturerId) {
                $q4->where('id', $lecturerId);
            });
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

    public function thesisRegisterForStudent(Request $request)
    {
        $query = ThesisRegistration::with([
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.reportPeriod.semester.academicYear',
            'students'
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('thesis', function ($q1) use ($search) {
                    $q1->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('students', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('thesis.lecturer', function ($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    });
            });
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

        if ($lecturerId = $request->input('lecturer')) {
            $query->whereHas('thesis.lecturer', function ($q4) use ($lecturerId) {
                $q4->where('id', $lecturerId);
            });
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

    public function index(Request $request)
    {
        $query = ThesisRegistration::with([
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.reportPeriod.semester.academicYear',
            'students'
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('thesis', function ($q1) use ($search) {
                    $q1->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('students', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('thesis.lecturer', function ($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    });
            });
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

        if ($lecturerId = $request->input('lecturer')) {
            $query->whereHas('thesis.lecturer', function ($q4) use ($lecturerId) {
                $q4->where('id', $lecturerId);
            });
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


    public function store($id, Request $request)
    {
        $validated = $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'exists:users,id',
        ], [
            'student_ids.required' => 'Vui lòng chọn ít nhất một sinh viên thực hiện.',
            'student_ids.array' => 'Danh sách sinh viên không hợp lệ.',
            'student_ids.min' => 'Phải chọn ít nhất một sinh viên.',
            'student_ids.*.exists' => 'Một hoặc nhiều sinh viên được chọn không tồn tại.',
        ]);

        // Lấy kỳ báo cáo của đề tài
        $thesis = Thesis::findOrFail($id);
        $reportPeriodId = $thesis->report_period_id;

        // Kiểm tra từng sinh viên xem đã đăng ký đề tài nào trong cùng kỳ chưa
        $conflictedStudents = [];

        foreach ($validated['student_ids'] as $studentId) {
            $hasRegistered = DB::table('thesis_registration_student as trs')
                ->join('thesis_registrations as tr', 'trs.thesis_registration_id', '=', 'tr.id')
                ->join('theses as t', 'tr.thesis_id', '=', 't.id')
                ->where('trs.student_id', $studentId)
                ->where('t.report_period_id', $reportPeriodId)
                ->exists();

            if ($hasRegistered) {
                $conflictedStudents[] = $studentId;
            }
        }

        if (!empty($conflictedStudents)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Một hoặc nhiều sinh viên đã đăng ký nhiều hơn 1 đề tài trong kỳ này.',
                'conflicted_student_ids' => $conflictedStudents
            ], 422);
        }

        // Lưu bản đăng ký
        $registration = ThesisRegistration::create([
            'thesis_id' => $id,
            'status' => 'pending',
        ]);

        $registration->students()->sync($validated['student_ids']);

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký đề tài thành công'
        ]);
    }
}
