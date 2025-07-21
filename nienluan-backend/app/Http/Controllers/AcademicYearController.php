<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicYear;

class AcademicYearController extends Controller
{
    public function getYearList()
    {
        $result = AcademicYear::all();

        return response()->json($result);
    }
    public function search(Request $request)
    {
        $query = AcademicYear::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
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
        $query = AcademicYear::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
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
            'name' => 'required|string|max:255|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên năm học là bắt buộc.',
            'name.unique' => 'Năm học đã tồn tại.',
            'start_date.required' => 'Vui lòng nhập ngày bắt đầu.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
        ]);


        //Kiểm tra trùng thời gian với năm học khác
        $overlap = AcademicYear::where(function ($q) use ($request) {
            $q->where('start_date', '<=', $request->end_date)
                ->where('end_date', '>=', $request->start_date);
        })->exists();

        if ($overlap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Khoảng thời gian đã tồn tại trong một năm học khác.',
            ], 422);
        }

        //Nếu is_active là true thì cập nhật các năm khác về false 
        //(đảm bảo 1 thời điểm chỉ có 1 năm học là active)
        if ($request->boolean('is_active')) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        //Lưu dữ liệu
        $result = AcademicYear::create($request->all());

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm năm học mới thành công!',
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Thêm năm học mới thất bại, vui lòng kiểm tra lại!',
            ], 400);
        }
    }


    public function show($id)
    {
        return AcademicYear::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $year = AcademicYear::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:academic_years,name,' . $id,
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên năm học là bắt buộc.',
            'name.unique' => 'Năm học đã tồn tại.',
            'start_date.required' => 'Vui lòng nhập ngày bắt đầu.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
        ]);

        // Kiểm tra trùng khoảng thời gian với các năm học khác
        $overlap = AcademicYear::where('id', '!=', $id)
            ->where(function ($q) use ($request) {
                $q->where('start_date', '<=', $request->end_date)
                    ->where('end_date', '>=', $request->start_date);
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Khoảng thời gian đã tồn tại trong một năm học khác.',
            ], 422);
        }

        // Nếu is_active là true thì cập nhật các năm khác về false
        if ($request->boolean('is_active')) {
            AcademicYear::where('id', '!=', $id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        // Cập nhật dữ liệu
        $updated = $year->update($request->all());

        if ($updated) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật năm học thành công!',
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Cập nhật năm học thất bại, vui lòng kiểm tra lại!',
            ], 400);
        }
    }


    public function destroy($id)
    {
        $year = AcademicYear::findOrFail($id);
        $result = $year->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa năm học thành công!'
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
        $multiYears = $request->all();

        foreach ($multiYears as $year) {
            $year = AcademicYear::findOrFail($year);
            $result = $year->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa thành công'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
}
