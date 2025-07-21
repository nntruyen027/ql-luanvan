<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PermissionGroupController extends Controller
{
    public function searchPermissionGroup(Request $request)
    {
        $user = auth()->user();

        $isSuperAdmin = $user->roles()->whereIn('name', ['super_admin', 'Super_admin'])->exists();

        if ($isSuperAdmin) {
            $query = Role::with('permissions');
        } else {
            $query = Role::with('permissions')->whereNotIn('name', ['super_admin', 'Super_admin']);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
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
    public function deleteMultiPermissionGroup(Request $request)
    {
        $ids = $request->all();

        // Validate trực tiếp mảng id
        $validator = Validator::make(['ids' => $ids], [
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ], [
            'ids.required' => 'Danh sách nhóm quyền cần xóa không được để trống.',
            'ids.*.exists' => 'Một hoặc nhiều nhóm quyền không tồn tại.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $errors = [];

        try {
            DB::beginTransaction();

            foreach ($ids as $id) {
                $role = Role::find($id);

                if (!$role) {
                    $errors[] = "Nhóm quyền ID $id không tồn tại.";
                    continue;
                }

                // Bảo vệ nhóm quyền hệ thống
                if (in_array($role->name, ['admin', 'super_admin'])) {
                    $errors[] = "Không được phép xóa nhóm quyền hệ thống: {$role->name}.";
                    continue;
                }

                // Không cho xóa nếu đang được dùng
                if ($role->users()->exists()) {
                    $errors[] = "Không thể xóa nhóm quyền '{$role->name}' vì đang được sử dụng.";
                    continue;
                }

                // Xóa quyền liên kết
                DB::table('permission_role')->where('role_id', $role->id)->delete();

                // Xóa chính role
                $role->delete();
            }

            DB::commit();

            return response()->json([
                'status' => empty($errors) ? 'success' : 'error',
                'message' => empty($errors)
                    ? 'Xóa các nhóm quyền thành công.'
                    : 'Một số nhóm quyền không thể xóa.',
                'errors' => $errors,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa nhóm quyền: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function deleteRole($id)
    {
        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);

            // Không cho phép xóa các nhóm quyền hệ thống
            if (in_array($role->name, ['admin', 'super_admin'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không được phép xóa nhóm quyền hệ thống.',
                ], 403);
            }

            // Không cho xóa nếu vẫn còn user đang dùng role này
            if ($role->users()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể xóa nhóm quyền vì vẫn còn người dùng đang sử dụng.',
                ], 400);
            }

            // Xóa các quyền liên kết nếu có
            DB::table('permission_role')->where('role_id', $role->id)->delete();

            // Xóa chính nhóm quyền
            $role->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa nhóm quyền thành công!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa nhóm quyền: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
        ], [
            'name.required' => 'Tên nhóm quyền không được bỏ trống.',
            'name.string' => 'Tên nhóm quyền phải là chuỗi.',
            'name.max' => 'Tên nhóm quyền không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên nhóm quyền đã tồn tại.'
        ]);

        try {
            DB::beginTransaction();

            $role = Role::findOrFail($id);
            $role->name = $validated['name'];
            $role->save();

            // Cập nhật lại các quyền: xóa cũ, thêm mới
            DB::table('permission_role')->where('role_id', $role->id)->delete();

            if (!empty($validated['permissions'])) {
                $permissionInsert = collect($validated['permissions'])->map(function ($item) use ($role) {
                    return [
                        'permission_id' => $item['permission_id'],
                        'role_id' => $role->id,
                    ];
                })->toArray();

                DB::table('permission_role')->insert($permissionInsert);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật nhóm quyền thành công!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật nhóm quyền: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function addRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
        ], [
            'name.required' => 'Tên nhóm quyền không được bỏ trống.',
            'name.string' => 'Tên nhóm quyền phải là chuỗi.',
            'name.max' => 'Tên nhóm quyền không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên nhóm quyền đã tồn tại.',
        ]);

        try {
            DB::beginTransaction();

            // Tạo role mới
            $role = Role::create([
                'name' => $validated['name'],
            ]);

            // Insert vào bảng permission_role nếu có permission
            if (!empty($validated['permissions'])) {
                $permissionInsert = collect($validated['permissions'])->map(function ($item) use ($role) {
                    return [
                        'permission_id' => $item['permission_id'],
                        'role_id' => $role->id,
                    ];
                })->toArray();

                DB::table('permission_role')->insert($permissionInsert);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo nhóm quyền thành công!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo nhóm quyền: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function allRole()
    {
        $result = Permission::orderBy('id', 'desc')->get();

        return response()->json($result);
    }
    public function index(Request $request)
    {
        $user = auth()->user();

        $isSuperAdmin = $user->roles()->whereIn('name', ['super_admin', 'Super_admin'])->exists();

        if ($isSuperAdmin) {
            $query = Role::with('permissions');
        } else {
            $query = Role::with('permissions')->whereNotIn('name', ['super_admin', 'Super_admin']);
        }


        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
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
}
