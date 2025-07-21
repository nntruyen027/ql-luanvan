<?php

namespace App\Http\Controllers;

use App\Models\ReportPeriod;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportPeriodController extends Controller
{
    public function destroyMulti(Request $request)
    {
        $multiReportPeriod = $request->all();

        foreach ($multiReportPeriod as $reportPeriod) {
            $reportPeriod = ReportPeriod::findOrFail($reportPeriod);
            $result = $reportPeriod->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa kỳ báo cáo thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
    public function destroy($id)
    {
        $reportPeriod = ReportPeriod::findOrFail($id);
        $result = $reportPeriod->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa kỳ báo cáo thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }

    public function getSemesterByYear($id)
    {
        $semesters = Semester::where('academic_year_id', $id)
            ->orderBy('academic_year_id', 'desc')
            ->orderBy('name')
            ->get();
        return response()->json($semesters);
    }
    public function getSemesterOptions()
    {
        $semesters = Semester::with('academicYear')
            ->where('is_active', 1)
            ->orderBy('academic_year_id', 'desc')
            ->orderBy('name')
            ->get();

        $options = $semesters->map(function ($semester) {
            return [
                'value' => $semester->id,
                'label' => $semester->name . ' - ' . $semester->academicYear->name,
            ];
        });

        return response()->json($options);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'semester_id' => 'required|exists:semesters,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'required|boolean',
        ], [
            'name.required' => 'Tên kỳ báo cáo là bắt buộc.',
            'semester_id.required' => 'Học kỳ là bắt buộc.',
            'semester_id.exists' => 'Học kỳ không hợp lệ.',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.date' => 'Ngày bắt đầu không đúng định dạng.',
            'end_date.required' => 'Ngày kết thúc là bắt buộc.',
            'end_date.date' => 'Ngày kết thúc không đúng định dạng.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'is_active.required' => 'Trạng thái là bắt buộc.',
            'is_active.boolean' => 'Trạng thái không hợp lệ.',
        ]);

        $reportPeriod = ReportPeriod::findOrFail($id);
        $semester = Semester::find($validated['semester_id']);

        // Kiểm tra ngày hợp lệ trong học kỳ
        if (
            $validated['start_date'] < $semester->start_date ||
            $validated['end_date'] > $semester->end_date
        ) {
            return response()->json([
                'message' => 'Ngày bắt đầu và kết thúc của kỳ báo cáo phải nằm trong khoảng thời gian của học kỳ.',
                'status' => 'error',
            ], 422);
        }

        // Kiểm tra chồng lấn (loại trừ chính kỳ đang cập nhật)
        $overlaps = ReportPeriod::where('semester_id', $validated['semester_id'])
            ->where('id', '!=', $id)
            ->where(function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->where('start_date', '<=', $validated['end_date'])
                        ->where('end_date', '>=', $validated['start_date']);
                });
            })->exists();

        if ($overlaps) {
            return response()->json([
                'message' => 'Kỳ báo cáo này có thời gian trùng với một kỳ báo cáo khác trong học kỳ.',
                'status' => 'error',
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($validated['is_active']) {
                ReportPeriod::where('semester_id', $validated['semester_id'])
                    ->where('id', '!=', $id)
                    ->update(['is_active' => false]);
            }

            $reportPeriod->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật kỳ báo cáo thành công.',
                'status' => 'success',
                'data' => $reportPeriod,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật kỳ báo cáo.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'semester_id' => 'required|exists:semesters,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'required|boolean',
        ], [
            'name.required' => 'Tên kỳ báo cáo là bắt buộc.',
            'semester_id.required' => 'Học kỳ là bắt buộc.',
            'semester_id.exists' => 'Học kỳ không hợp lệ.',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.date' => 'Ngày bắt đầu không đúng định dạng.',
            'end_date.required' => 'Ngày kết thúc là bắt buộc.',
            'end_date.date' => 'Ngày kết thúc không đúng định dạng.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'is_active.required' => 'Trạng thái là bắt buộc.',
            'is_active.boolean' => 'Trạng thái không hợp lệ.',
        ]);

        // Kiểm tra ngày của kỳ báo cáo nằm trong khoảng học kỳ
        $semester = Semester::find($validated['semester_id']);

        if (
            $validated['start_date'] < $semester->start_date ||
            $validated['end_date'] > $semester->end_date
        ) {
            return response()->json([
                'message' => 'Ngày bắt đầu và kết thúc của kỳ báo cáo phải nằm trong khoảng thời gian của học kỳ.',
                'status' => 'error',
            ], 422);
        }

        // Kiểm tra không chồng lấn với các kỳ báo cáo khác
        $overlaps = ReportPeriod::where('semester_id', $validated['semester_id'])
            ->where(function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->where('start_date', '<=', $validated['end_date'])
                        ->where('end_date', '>=', $validated['start_date']);
                });
            })->exists();

        if ($overlaps) {
            return response()->json([
                'message' => 'Kỳ báo cáo này có thời gian trùng với một kỳ báo cáo khác trong học kỳ.',
                'status' => 'error',
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($validated['is_active']) {
                ReportPeriod::where('semester_id', $validated['semester_id'])
                    ->update(['is_active' => false]);
            }

            $reportPeriod = ReportPeriod::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'Thêm kỳ báo cáo thành công.',
                'status' => 'success',
                'data' => $reportPeriod,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm kỳ báo cáo.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = ReportPeriod::with(['semester.academicYear']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($year = $request->input('year')) {
            // Lọc qua mối quan hệ semester -> academicYear
            $query->whereHas('semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->where('semester_id', $semesterId);
        }

        $periodReport = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $periodReport->items(),
            'total' => $periodReport->total(),
            'page' => $periodReport->currentPage(),
            'per_page' => $periodReport->perPage(),
        ]);
    }
    public function search(Request $request)
    {
        $query = ReportPeriod::with(['semester.academicYear']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($year = $request->input('year')) {
            // Lọc qua mối quan hệ semester -> academicYear
            $query->whereHas('semester.academicYear', function ($q) use ($year) {
                $q->where('id', $year);
            });
        }

        if ($semesterId = $request->input('semester')) {
            $query->where('semester_id', $semesterId);
        }

        $periodReport = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $periodReport->items(),
            'total' => $periodReport->total(),
            'page' => $periodReport->currentPage(),
            'per_page' => $periodReport->perPage(),
        ]);
    }
}
