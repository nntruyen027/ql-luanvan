<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => [
                'required',
                'string',
                'min:6',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/'
            ],
        ], [
            'newPassword.regex' => 'Mật khẩu phải có ít nhất 6 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
            'newPassword.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ]);

        $user = User::findOrFail($id);

        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Mật khẩu hiện tại không đúng'], 422);
        }

        $user->password = Hash::make($request->newPassword);
        $result = $user->save();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Đổi mật khẩu thành công'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Đổi mật khẩu thất bại'
            ], 400);
        }
    }

    public function getCurrentUser()
    {
        $user = auth()->user();
        return response()->json([
            'user' => $user->only(['id', 'name', 'user_code', 'email', 'phone_number', 'major_id', 'avatar']),
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sai tài khoản hoặc mật khẩu'
            ], 401);
        }

        // $user = Auth::user();

        $user = auth()->user()->load('roles.permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user->only(['id', 'name', 'user_code', 'email', 'phone_number', 'major_id', 'avatar']),
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            }),
            'permissions' => $user->roles
                ->flatMap->permissions
                ->pluck('code')
                ->unique()
                ->values(),
        ]);
    }
}
