<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    public function destroyMultiPermission(Request $request)
    {
        $ids = $request->all();

        if (empty($ids)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có ID nào được gửi lên.'
            ], 422);
        }

        try {
            foreach ($ids as $id) {
                $permission = Permission::findOrFail($id);

                // Xóa bản ghi trung gian thủ công
                $permission->roles()->detach();

                // Xóa quyền chính
                $permission->delete();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa quyền thành công!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function updatePermission($id, Request $request)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy quyền cần cập nhật.'
            ], 404);
        }

        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'module' => 'required|string|max:255',
            'action' => 'required|string|max:255',
            'code' => [
                'required',
                'regex:/^[a-z]+:[a-z\-]+$/', // Cho phép gạch ngang ở phần sau
                Rule::unique('permissions', 'code')->ignore($id) // Cho phép trùng code nếu là của chính nó
            ],
        ], [
            'module.required' => 'Vui lòng chọn module.',
            'module.string' => 'Module phải là chuỗi.',
            'module.max' => 'Module không được vượt quá 255 ký tự.',

            'action.required' => 'Vui lòng chọn hành động.',
            'action.string' => 'Hành động phải là chuỗi.',
            'action.max' => 'Hành động không được vượt quá 255 ký tự.',

            'code.required' => 'Vui lòng nhập mã quyền.',
            'code.regex' => 'Mã quyền phải có định dạng dạng hợp lệ, ví dụ: access:academic-affairs.',
            'code.unique' => 'Mã quyền này đã tồn tại.'
        ]);

        // Trả lỗi nếu không hợp lệ
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cập nhật dữ liệu
        $permission->update([
            'module' => $request->module,
            'action' => $request->action,
            'code' => $request->code,
        ]);

        if ($permission) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật quyền thành công.'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Cập nhật quyền thất bại.'
            ], 400);
        }
    }

    public function deletePermisson($id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Quyền không tồn tại.'
            ], 404);
        }

        $permission->delete(); // Xoá quyền và quan hệ trung gian do cascade

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xoá quyền thành công.'
        ]);
    }
    public function addPermisson(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'module' => 'required|string|max:255',
            'action' => 'required|string|max:255',
            'code' => [
                'required',
                'regex:/^[a-z]+:[a-z\-]+$/', // Cho phép gạch ngang ở phần sau
                'unique:permissions,code'
            ]
        ], [
            'module.required' => 'Vui lòng chọn module.',
            'module.string' => 'Module phải là chuỗi.',
            'module.max' => 'Module không được vượt quá 255 ký tự.',

            'action.required' => 'Vui lòng chọn hành động.',
            'action.string' => 'Hành động phải là chuỗi.',
            'action.max' => 'Hành động không được vượt quá 255 ký tự.',

            'code.required' => 'Vui lòng nhập mã quyền.',
            'code.regex' => 'Mã quyền phải có định dạng dạng hợp lệ, ví dụ: access:academic-affairs.',
            'code.unique' => 'Mã quyền này đã tồn tại.'
        ]);

        // Trả lỗi nếu không hợp lệ
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Lưu quyền mới
        $permission = Permission::create([
            'module' => $request->module,
            'action' => $request->action,
            'code' => $request->code,
        ]);

        if ($permission) {
            return response()->json([
                'status' => 'success',
                'message' => 'Thêm quyền thành công.'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Thêm quyền thất bại.'
            ], 400);
        }
    }

    public function search(Request $request)
    {
        $query = Permission::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%");
            });
        }

        // Lọc theo module
        if ($module = $request->input('module')) {
            $query->where('module', $module);
        }

        // Lọc theo action
        if ($action = $request->input('action')) {
            $query->where('action', $action);
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
        $query = Permission::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%");
            });
        }

        // Lọc theo module
        if ($module = $request->input('module')) {
            $query->where('module', $module);
        }

        // Lọc theo action
        if ($action = $request->input('action')) {
            $query->where('action', $action);
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
}
