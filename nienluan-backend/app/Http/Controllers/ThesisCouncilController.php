<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\ThesisCouncil;
use App\Models\ThesisCouncilMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ThesisCouncilController extends Controller
{
    public function filterCommittee(Request $request)
    {
        $query = ThesisCouncil::with([
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.reportPeriod.semester.academicYear',
            'thesis.registrations.students',
            'members.user'
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('thesis', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('thesis.registrations.students', function ($q) use ($search) {
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

        $perPage = $request->input('per_page', 10);

        $theses = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $theses->items(),
            'total' => $theses->total(),
            'page' => $theses->currentPage(),
            'per_page' => $theses->perPage(),
        ]);
    }
    public function destroyMulti(Request $request)
    {
        $multiCommittee = $request->all();

        foreach ($multiCommittee as $committeeId) {
            ThesisCouncilMember::where('thesis_council_id', $committeeId)->delete();

            $result = ThesisCouncil::where('id', $committeeId)->delete();
        }


        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa hội đồng luận văn thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 400);
        }
    }
    public function deleteCommittee($id)
    {
        $member = ThesisCouncilMember::where('thesis_council_id', $id)->first();

        if ($member) {
            $member->delete();
            $result = ThesisCouncil::where('id', $id)->delete();

            if ($result) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Xóa hội đồng luận văn thành công.'
                ], 201);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Xóa hội đồng luận văn thất bại, vui lòng kiểm tra lại.'
                ], 400);
            }
        }
    }
    public function getTeacherOptions()
    {
        $teacher = User::where('role', 'Giảng viên')->get();

        return response()->json($teacher);
    }
    public function getCommitteeList(Request $request)
    {
        $query = ThesisCouncil::with([
            'thesis.lecturer',
            'thesis.attachments',
            'thesis.reportPeriod.semester.academicYear',
            'thesis.registrations.students',
            'members.user'
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('thesis', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('thesis.registrations.students', function ($q) use ($search) {
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

        $perPage = $request->input('per_page', 10);

        $theses = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $theses->items(),
            'total' => $theses->total(),
            'page' => $theses->currentPage(),
            'per_page' => $theses->perPage(),
        ]);
    }
    public function addCouncil(Request $request)
    {
        //Validate cơ bản
        $validator = Validator::make($request->all(), [
            'thesis_id' => 'required|exists:theses,id',
            'members' => 'required|array|min:3',
            'members.*.user_id' => 'required|exists:users,id',
            'members.*.position' => 'required|string'
        ], [
            'thesis_id.required' => 'Vui lòng chọn đề tài.',
            'thesis_id.exists' => 'Đề tài không tồn tại.',
            'members.required' => 'Danh sách thành viên là bắt buộc.',
            'members.min' => 'Cần ít nhất 3 thành viên trong hội đồng.',
            'members.*.user_id.required' => 'Thiếu thông tin thành viên.',
            'members.*.user_id.exists' => 'Thành viên không tồn tại.',
            'members.*.position.required' => 'Vui lòng nhập vai trò của thành viên.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        //Lấy giảng viên hướng dẫn và thông tin kỳ báo cáo của đề tài
        $thesis = Thesis::with('lecturer', 'reportPeriod.semester.academicYear')->findOrFail($validated['thesis_id']);
        $lecturerId = $thesis->lecturer->id;
        $reportPeriod = $thesis->reportPeriod;

        //Kiểm tra xem đã có hội đồng nào trong cùng kỳ báo cáo chưa
        $existingCouncil = ThesisCouncil::whereHas('thesis', function ($query) use ($reportPeriod) {
            $query->whereHas('reportPeriod', function ($q) use ($reportPeriod) {
                $q->where('id', $reportPeriod->id)
                    ->whereHas('semester', function ($s) use ($reportPeriod) {
                        $s->where('id', $reportPeriod->semester->id)
                            ->whereHas('academicYear', function ($y) use ($reportPeriod) {
                                $y->where('id', $reportPeriod->semester->academicYear->id);
                            });
                    });
            });
        })->where('thesis_id', $thesis->id)->exists();

        if ($existingCouncil) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đề tài này đã có hội đồng trong cùng năm học, học kỳ và kỳ báo cáo.'
            ], 422);
        }

        //Kiểm tra vai trò giảng viên hướng dẫn
        $matchedMember = collect($validated['members'])->firstWhere('user_id', $lecturerId);

        if (!$matchedMember || $matchedMember['position'] !== 'Thư ký') {
            return response()->json([
                'status' => 'error',
                'message' => 'Giảng viên hướng dẫn phải là thư ký trong hội đồng.'
            ], 422);
        }

        //Tạo hội đồng
        $council = ThesisCouncil::create([
            'thesis_id' => $validated['thesis_id'],
        ]);

        //Tạo thành viên
        foreach ($validated['members'] as $member) {
            ThesisCouncilMember::create([
                'thesis_council_id' => $council->id,
                'user_id' => $member['user_id'],
                'position' => $member['position']
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo hội đồng luận văn thành công.',
        ], 201);
    }
    public function updateCommittee(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'thesis_id' => 'required|exists:theses,id',
            'members' => 'required|array|min:3',
            'members.*.user_id' => 'required|exists:users,id',
            'members.*.position' => 'required|string'
        ], [
            'thesis_id.required' => 'Vui lòng chọn đề tài.',
            'thesis_id.exists' => 'Đề tài không tồn tại.',
            'members.required' => 'Danh sách thành viên là bắt buộc.',
            'members.min' => 'Cần ít nhất 3 thành viên trong hội đồng.',
            'members.*.user_id.required' => 'Thiếu thông tin thành viên.',
            'members.*.user_id.exists' => 'Thành viên không tồn tại.',
            'members.*.position.required' => 'Vui lòng nhập vai trò của thành viên.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $thesis = Thesis::with('lecturer')->findOrFail($validated['thesis_id']);
        $lecturerId = $thesis->lecturer->id;

        // Bắt buộc giảng viên hướng dẫn là thư ký
        $matchedMember = collect($validated['members'])->firstWhere('user_id', $lecturerId);
        if (!$matchedMember || $matchedMember['position'] !== 'Thư ký') {
            return response()->json([
                'status' => 'error',
                'message' => 'Giảng viên hướng dẫn phải là thư ký trong hội đồng.'
            ], 422);
        }

        // Tìm hội đồng đã có
        $council = ThesisCouncil::where('id', $id)->first();
        if (!$council) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hội đồng chưa tồn tại để cập nhật.'
            ], 404);
        }

        // Lấy danh sách user_id hiện tại trong DB
        $newMemberIds = collect($validated['members'])->pluck('user_id')->toArray();

        // Xoá các thành viên không còn nữa
        ThesisCouncilMember::where('thesis_council_id', $council->id)
            ->whereNotIn('user_id', $newMemberIds)
            ->delete();

        // Cập nhật hoặc thêm mới các thành viên
        foreach ($validated['members'] as $member) {
            ThesisCouncilMember::updateOrCreate(
                [
                    'thesis_council_id' => $council->id,
                    'user_id' => $member['user_id'],
                ],
                [
                    'position' => $member['position'],
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật hội đồng thành công.',
        ]);
    }
}
