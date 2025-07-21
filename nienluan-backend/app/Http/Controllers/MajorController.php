<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Major;
use App\Models\Role;
use Illuminate\Validation\Rule;

class MajorController extends Controller
{
    public function getRolesListOptions()
    {
        $user = auth()->user();

        $isSuperAdmin = $user->roles()->whereIn('name', ['super_admin', 'Super_admin'])->exists();

        if ($isSuperAdmin) {
            $roles = Role::with('permissions')->orderBy('id', 'desc')->get();
        } else {
            $roles = Role::with('permissions')->whereNotIn('name', ['super_admin', 'Super_admin'])->orderBy('id', 'desc')->get();
        }


        return response()->json($roles);
    }
    public function search(Request $request)
    {
        $query = Major::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
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
    public function getMajorListOptions()
    {
        $majors = Major::all();

        return response()->json($majors);
    }
    public function index(Request $request)
    {
        $query = Major::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
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
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:majors,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên ngành là bắt buộc.',
            'code.required' => 'Mã ngành là bắt buộc.',
            'code.unique' => 'Mã ngành đã tồn tại.',
        ]);

        $major = Major::create($request->all());

        if ($major) {
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm ngành học thành công!',
                'data' => $major,
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm ngành học, vui lòng thử lại.',
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $major = Major::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('majors', 'code')->ignore($major->id),
            ],
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên ngành là bắt buộc.',
            'code.required' => 'Mã ngành là bắt buộc.',
            'code.unique' => 'Mã ngành đã tồn tại.',
        ]);

        $updated = $major->update($request->all());

        if ($updated) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật ngành học thành công!',
                'data' => $major,
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Cập nhật ngành học thất bại, vui lòng thử lại.',
            ], 422);
        }
    }

    public function destroy($id)
    {
        $major = Major::findOrFail($id);
        $result = $major->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa ngành học thành công!'
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
        $multiMajor = $request->all();

        foreach ($multiMajor as $major) {
            $major = Major::findOrFail($major);
            $result = $major->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa ngành học thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
}
