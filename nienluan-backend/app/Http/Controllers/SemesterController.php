<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SemesterController extends Controller
{
    public function search(Request $request)
    {
        $query = Semester::with('academicYear');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($yearId = $request->input('year')) {
            $query->where('academic_year_id', $yearId);
        }

        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = $request->input('sort_order', 'desc');

        $data = $query->orderBy($sortBy, $sortOrder)
            ->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $data->items(),
            'total' => $data->total(),
            'page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function index(Request $request)
    {
        $query = Semester::with('academicYear');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($yearId = $request->input('year')) {
            $query->where(function ($q) use ($yearId) {
                $q->whereHas('academicYear', function ($q) use ($yearId) {
                    $q->where('id', $yearId);
                });
            });
        }

        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = $request->input('sort_order', 'desc');

        $data = $query->orderBy($sortBy, $sortOrder)
            ->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $data->items(),
            'total' => $data->total(),
            'page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('semesters')->where(function ($query) use ($request) {
                    return $query->where('academic_year_id', $request->academic_year_id);
                }),
            ],
            'academic_year_id' => 'required|exists:academic_years,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên kỳ học là bắt buộc.',
            'name.unique' => 'Tên kỳ học đã tồn tại trong năm học này.',
            'academic_year_id.required' => 'Vui lòng chọn năm học.',
            'start_date.required' => 'Vui lòng nhập ngày bắt đầu.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
        ]);

        // Lấy thông tin năm học để kiểm tra khoảng thời gian
        $academicYear = AcademicYear::find($request->academic_year_id);

        if ($request->start_date < $academicYear->start_date || $request->end_date > $academicYear->end_date) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ngày bắt đầu và kết thúc của kỳ học phải nằm trong khoảng thời gian của năm học.',
            ], 422);
        }

        // Kiểm tra trùng thời gian với kỳ học khác trong cùng năm học
        $overlap = Semester::where('academic_year_id', $request->academic_year_id)
            ->where(function ($q) use ($request) {
                $q->where('start_date', '<=', $request->end_date)
                    ->where('end_date', '>=', $request->start_date);
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Khoảng thời gian đã tồn tại trong một kỳ học khác của năm học này.',
            ], 422);
        }

        // Nếu is_active là true thì cập nhật các kỳ khác về false trong cùng năm học
        if ($request->boolean('is_active')) {
            Semester::where('academic_year_id', $request->academic_year_id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        // Lưu dữ liệu
        $semester = Semester::create($request->all());

        if ($semester) {
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm kỳ học mới thành công!',
                'data' => $semester
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Thêm kỳ học thất bại, vui lòng kiểm tra lại!',
            ], 400);
        }
    }

    public function show($id)
    {
        return Semester::with('academicYear')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $semester = Semester::findOrFail($id);

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('semesters')->where(function ($query) use ($request) {
                    return $query->where('academic_year_id', $request->academic_year_id);
                })->ignore($id), // Bỏ qua chính bản ghi đang update
            ],
            'academic_year_id' => 'required|exists:academic_years,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên kỳ học là bắt buộc.',
            'name.unique' => 'Tên kỳ học đã tồn tại trong năm học này.',
            'academic_year_id.required' => 'Vui lòng chọn năm học.',
            'start_date.required' => 'Vui lòng nhập ngày bắt đầu.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
        ]);

        // Lấy thông tin năm học để kiểm tra khoảng thời gian
        $academicYear = AcademicYear::find($request->academic_year_id);

        if ($request->start_date < $academicYear->start_date || $request->end_date > $academicYear->end_date) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ngày bắt đầu và kết thúc của kỳ học phải nằm trong khoảng thời gian của năm học.',
            ], 422);
        }


        // Kiểm tra trùng thời gian với kỳ học khác trong cùng năm học
        $overlap = Semester::where('academic_year_id', $request->academic_year_id)
            ->where('id', '!=', $id)
            ->where(function ($q) use ($request) {
                $q->where('start_date', '<=', $request->end_date)
                    ->where('end_date', '>=', $request->start_date);
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Khoảng thời gian đã tồn tại trong một kỳ học khác của năm học này.',
            ], 422);
        }

        // Nếu is_active là true thì cập nhật các kỳ khác về false trong cùng năm học
        if ($request->boolean('is_active')) {
            Semester::where('academic_year_id', $request->academic_year_id)
                ->where('id', '!=', $id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $updated = $semester->update($request->all());

        if ($updated) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật kỳ học thành công!',
                'data' => $semester->fresh('academicYear') // trả về bản ghi mới nhất kèm quan hệ
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Cập nhật kỳ học thất bại, vui lòng kiểm tra lại!',
            ], 400);
        }
    }

    public function destroy($id)
    {
        $semester = Semester::findOrFail($id);
        $result = $semester->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa kỳ học thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
    public function destroyMulti(Request $request)
    {
        $multiSemester = $request->all();

        foreach ($multiSemester as $semester) {
            $semester = Semester::findOrFail($semester);
            $result = $semester->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa kỳ học thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 400);
        }
    }
}
