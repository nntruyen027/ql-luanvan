<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    public function resetStudentAccount($id)
    {
        $student = User::findOrFail($id);

        $result = $student->update([
            'password' => bcrypt('NienLuan@2025')
        ]);

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Đặt lại mật khẩu tài khoản thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }

    public function resetTeacherAccount($id)
    {
        $teacher = User::findOrFail($id);

        $result = $teacher->update([
            'password' => bcrypt('NienLuan@2025')
        ]);

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Đặt lại mật khẩu tài khoản thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
    public function destroyMulti(Request $request)
    {
        $multiTeacher = $request->all();

        foreach ($multiTeacher as $teacher) {
            $teacher = User::findOrFail($teacher);

            $roleUser = DB::table('role_user')->where('user_id', $teacher->id)->delete();

            $result = $teacher->delete();
        }

        if ($roleUser && $result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa cán bộ thành công!'
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
        $teacher = User::findOrFail($id);
        $roleUser = DB::table('role_user')->where('user_id', $teacher->id)->delete();
        $result = $teacher->delete();

        if ($roleUser && $result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa cán bộ thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }

    public function updateUserInformation($id, Request $request)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng.',
                'status' => 'error',
            ], 404);
        }

        // Validate dữ liệu từ request
        $validated = $request->validate([
            'user_code' => 'required|string|max:50|unique:users,user_code,' . $user->id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone_number' => [
                'nullable',
                'regex:/^(0|\+84)[3|5|7|8|9][0-9]{8}$/',
                Rule::unique('users', 'phone_number')->ignore($user->id),
            ],
            'major_id' => 'nullable|exists:majors,id',
            'avatar' => 'nullable|image|mimes:jpeg,png|max:2048', // Validate ảnh: JPG/PNG, < 2MB
        ], [
            'user_code.required' => 'Mã cán bộ là bắt buộc.',
            'user_code.unique' => 'Mã cán bộ đã tồn tại.',
            'name.required' => 'Họ tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'phone_number.regex' => 'Số điện thoại không hợp lệ.',
            'phone_number.unique' => 'Số điện thoại đã tồn tại.',
            'major_id.exists' => 'Ngành học không hợp lệ.',
            'avatar.image' => 'File phải là ảnh.',
            'avatar.mimes' => 'Chỉ chấp nhận ảnh JPG hoặc PNG.',
            'avatar.max' => 'Ảnh phải nhỏ hơn 2MB.',
        ]);

        try {
            // Xử lý ảnh đại diện
            if ($request->hasFile('avatar')) {
                // Xóa ảnh cũ nếu tồn tại
                $storagePath = str_replace('/storage/', 'public/', $user->avatar);
                if (Storage::exists($storagePath)) {
                    Storage::delete($storagePath);
                }

                // Lưu ảnh mới
                $avatarFile = $request->file('avatar');
                $avatarName = time() . '_' . $avatarFile->getClientOriginalName();
                $avatarPath = $avatarFile->storeAs('avatar', $avatarName, 'public');
                $validated['avatar'] = Storage::url($avatarPath);
            }

            // Cập nhật thông tin người dùng
            $user->update([
                'user_code' => $validated['user_code'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'] ?? null,
                'major_id' => $validated['major_id'] ?? null,
                'avatar' => $validated['avatar'] ?? $user->avatar, // Giữ ảnh cũ nếu không upload ảnh mới
            ]);

            return response()->json([
                'message' => 'Cập nhật thông tin thành công.',
                'status' => 'success',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật thông tin.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $teacher = User::find($id);

        if (!$teacher) {
            return response()->json([
                'message' => 'Không tìm thấy cán bộ.',
                'status' => 'error',
            ], 404);
        }

        $validated = $request->validate([
            'user_code' => 'required|string|max:50|unique:users,user_code,' . $teacher->id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $teacher->id,
            'phone_number' => [
                'regex:/^(0|\+84)[3|5|7|8|9][0-9]{8}$/',
                Rule::unique('users', 'phone_number')->ignore($teacher->id),
            ],
            'major_id' => 'exists:majors,id',
            'role_id' => 'required'
        ], [
            'user_code.required' => 'Mã cán bộ là bắt buộc.',
            'user_code.unique' => 'Mã cán bộ đã tồn tại.',
            'name.required' => 'Họ tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'phone_number.regex' => 'Số điện thoại không hợp lệ.',
            'phone_number.unique' => 'Số điện thoại đã tồn tại.',
            'major_id.exists' => 'Ngành học không hợp lệ.',
            'role_id.required' => 'Nhóm quyền là bắt buộc.',
        ]);

        try {
            $role = Role::where('id', $request->role_id)->first();

            $teacher->update([
                'user_code' => $validated['user_code'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'major_id' => $validated['major_id'],
                'role' => $role->name
            ]);

            // Xóa role tồn tại trước đó
            DB::table('role_user')->where('user_id', $teacher->id)->delete();

            // Gán role mới vào
            $userRole = DB::table('role_user')->insert([
                'role_id' => $request->role_id,
                'user_id' => $teacher->id
            ]);

            if ($teacher && $userRole) {
                return response()->json([
                    'message' => 'Cập nhật cán bộ thành công.',
                    'status' => 'success',
                ]);
            } else {
                return response()->json([
                    'message' => 'Cập nhật cán bộ thất bại.',
                    'status' => 'error',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật cán bộ.',
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function updateStudent(Request $request, $id)
    {
        $student = User::find($id);

        if (!$student) {
            return response()->json([
                'message' => 'Không tìm thấy sinh viên',
                'status' => 'error',
            ], 404);
        }

        $validated = $request->validate([
            'user_code' => 'required|string|max:50|unique:users,user_code,' . $student->id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->id,
            'phone_number' => [
                'regex:/^(0|\+84)[3|5|7|8|9][0-9]{8}$/',
                Rule::unique('users', 'phone_number')->ignore($student->id),
            ],
            'major_id' => 'exists:majors,id',
            'role_id' => 'required'
        ], [
            'user_code.required' => 'Mã sinh viên là bắt buộc.',
            'user_code.unique' => 'Mã sinh viên đã tồn tại.',
            'name.required' => 'Họ tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'phone_number.regex' => 'Số điện thoại không hợp lệ.',
            'phone_number.unique' => 'Số điện thoại đã tồn tại.',
            'major_id.exists' => 'Ngành học không hợp lệ.',
            'role_id.required' => 'Nhóm quyền là bắt buộc.',
        ]);

        try {
            $role = Role::where('id', $request->role_id)->first();

            $student->update([
                'user_code' => $validated['user_code'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'major_id' => $validated['major_id'],
                'role' => $role->name
            ]);

            // Xóa role tồn tại trước đó
            DB::table('role_user')->where('user_id', $student->id)->delete();

            // Gán role mới vào
            $userRole = DB::table('role_user')->insert([
                'role_id' => $request->role_id,
                'user_id' => $student->id
            ]);

            if ($student && $userRole) {
                return response()->json([
                    'message' => 'Cập nhật sinh viên thành công.',
                    'status' => 'success',
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Cập nhật sinh viên thất bại.',
                    'status' => 'success',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật sinh viên.',
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addStudent(Request $request)
    {
        $validated = $request->validate([
            'user_code' => 'required|string|max:50|unique:users,user_code',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => [
                'regex:/^(0|\+84)[3|5|7|8|9][0-9]{8}$/',
                'unique:users,phone_number'
            ],
            'major_id' => 'exists:majors,id',
            'role_id' => 'required'
        ], [
            'user_code.required' => 'Mã sinh viên là bắt buộc.',
            'user_code.unique' => 'Mã sinh viên đã tồn tại.',
            'name.required' => 'Họ tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'phone_number.regex' => 'Số điện thoại không hợp lệ.',
            'phone_number.unique' => 'Số điện thoại đã tồn tại.',
            'major_id.exists' => 'Ngành học không hợp lệ.',
            'role_id.required' => 'Nhóm quyền là bắt buộc'
        ]);

        try {
            $role = Role::where('id', $request->role_id)->first();


            $student = User::create([
                'user_code' => $validated['user_code'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'major_id' => $validated['major_id'],
                'role' => $role->name
            ]);

            // Xóa role tồn tại trước đó
            DB::table('role_user')->where('user_id', $student->id)->delete();

            // Gán role mới vào
            $userRole = DB::table('role_user')->insert([
                'role_id' => $request->role_id,
                'user_id' => $student->id
            ]);

            if ($userRole && $student) {
                return response()->json([
                    'message' => 'Thêm sinh viên thành công.',
                    'status' => 'success',
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Thêm sinh viên thất bại.',
                    'status' => 'error',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm sinh viên.',
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createTeacherAccount($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'password' => [
                'required',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/'
            ],
        ], [
            'username.unique' => 'Tên tài khoản đã tồn tại.',
            'password.regex' => 'Mật khẩu phải có ít nhất 6 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $teacher = User::find($id);
        if (!$teacher) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy cán bộ với ID đã cho.',
            ], 404);
        }

        // Cập nhật username & password
        $teacher->username = $request->username;
        $teacher->password = bcrypt($request->password);
        $teacher->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tài khoản đã được tạo thành công.',
        ]);
    }


    public function createStudentAccount($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'password' => [
                'required',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/'
            ],
        ], [
            'username.unique' => 'Tên tài khoản đã tồn tại.',
            'password.regex' => 'Mật khẩu phải có ít nhất 6 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $student = User::find($id);
        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy cán bộ với ID đã cho.',
            ], 404);
        }

        // Cập nhật username & password
        $student->username = $request->username;
        $student->password = bcrypt($request->password);
        $student->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tài khoản đã được tạo thành công.',
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_code' => 'required|string|max:50|unique:users,user_code',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => [
                'regex:/^(0|\+84)[3|5|7|8|9][0-9]{8}$/',
                'unique:users,phone_number'
            ],
            'major_id' => 'exists:majors,id',
            'role_id' =>  'required'
        ], [
            'user_code.required' => 'Mã cán bộ là bắt buộc.',
            'user_code.unique' => 'Mã cán bộ đã tồn tại.',
            'name.required' => 'Họ tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'phone_number.regex' => 'Số điện thoại không hợp lệ.',
            'phone_number.unique' => 'Số điện thoại đã tồn tại.',
            'major_id.exists' => 'Ngành học không hợp lệ.',
            'role_id.required' => 'Nhóm quyền là bắt buộc'
        ]);

        try {
            $role = Role::where('id', $request->role_id)->first();


            $teacher = User::create([
                'user_code' => $validated['user_code'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'major_id' => $validated['major_id'],
                'role' => $role->name
            ]);

            // Xóa role tồn tại trước đó
            DB::table('role_user')->where('user_id', $teacher->id)->delete();

            // Gán role mới vào
            $userRole = DB::table('role_user')->insert([
                'role_id' => $request->role_id,
                'user_id' => $teacher->id
            ]);

            if ($teacher && $userRole) {
                return response()->json([
                    'message' => 'Thêm cán bộ thành công.',
                    'status' => 'success',
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Thêm cán bộ thất bại.',
                    'status' => 'error',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm cán bộ.',
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function studentList(Request $request)
    {
        $query = User::with(['major', 'roles'])->where('role', 'Sinh viên');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('user_code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }


        if ($majorId = $request->input('major')) {
            $query->where('major_id', $majorId);
        }

        $periodReport = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $periodReport->items(),
            'total' => $periodReport->total(),
            'page' => $periodReport->currentPage(),
            'per_page' => $periodReport->perPage(),
        ]);
    }
    public function index(Request $request)
    {
        $user = auth()->user();

        $isSuperAdmin = $user->roles()->whereIn('name', ['super_admin', 'Super_admin'])->exists();

        if ($isSuperAdmin) {
            $query = User::with(['major', 'roles'])
                ->whereHas('roles', function (Builder $query) {
                    $query->whereIn('name', ['Giảng viên', 'Admin']);
                })
                ->whereDoesntHave('roles', function (Builder $query) {
                    $query->whereIn('name', ['super_admin', 'Super_admin']);
                });
        } else {
            $query = User::with(['major', 'roles'])->where('role', 'Giảng viên');
        }



        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('user_code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }


        if ($majorId = $request->input('major')) {
            $query->where('major_id', $majorId);
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
        $user = auth()->user(); // hoặc $request->user()

        $isSuperAdmin = $user->roles()->whereIn('name', ['super_admin', 'Super_admin'])->exists();

        if ($isSuperAdmin) {
            $query = User::with(['major', 'roles'])
                ->whereHas('roles', function (Builder $query) {
                    $query->whereIn('name', ['Giảng viên', 'Admin']);
                })
                ->whereDoesntHave('roles', function (Builder $query) {
                    $query->whereIn('name', ['super_admin', 'Super_admin']);
                });
        } else {
            $query = User::with(['major', 'roles'])->where('role', 'Giảng viên');
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('user_code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }


        if ($majorId = $request->input('major')) {
            $query->where('major_id', $majorId);
        }

        $periodReport = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $periodReport->items(),
            'total' => $periodReport->total(),
            'page' => $periodReport->currentPage(),
            'per_page' => $periodReport->perPage(),
        ]);
    }

    public function searchStudent(Request $request)
    {
        $query = User::with(['major', 'roles'])->where('role', 'Sinh viên');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('user_code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }


        if ($majorId = $request->input('major')) {
            $query->where('major_id', $majorId);
        }

        $periodReport = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $periodReport->items(),
            'total' => $periodReport->total(),
            'page' => $periodReport->currentPage(),
            'per_page' => $periodReport->perPage(),
        ]);
    }

    public function destroyMultiStudent(Request $request)
    {
        $multiStudent = $request->all();

        foreach ($multiStudent as $student) {
            $student = User::findOrFail($student);
            $roleUser = DB::table('role_user')->where('user_id', $student->id)->delete();
            $result = $student->delete();
        }

        if ($result && $roleUser) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa sinh viên thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
    public function destroyStudent($id)
    {
        $student = User::findOrFail($id);
        $roleUser = DB::table('role_user')->where('user_id', $student->id)->delete();
        $result = $student->delete();

        if ($result && $roleUser) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa sinh viên thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
}
