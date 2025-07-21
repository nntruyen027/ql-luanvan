<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Room;

class RoomController extends Controller
{
    public function search(Request $request)
    {
        $query = Room::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $rooms = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $rooms->items(),
            'total' => $rooms->total(),
            'page' => $rooms->currentPage(),
            'per_page' => $rooms->perPage(),
        ]);
    }

    public function index(Request $request)
    {
        $query = Room::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $rooms = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 10));

        return response()->json([
            'items' => $rooms->items(),
            'total' => $rooms->total(),
            'page' => $rooms->currentPage(),
            'per_page' => $rooms->perPage(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:rooms,name',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên phòng là bắt buộc.',
            'name.unique' => 'Tên phòng đã tồn tại. Vui lòng nhập tên phòng không trùng hoặc thêm hậu tố phía sau!',
        ]);

        try {
            $room = Room::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm phòng thành công!',
                'data' => $room,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm phòng, vui lòng thử lại.',
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms', 'name')->ignore($room->id),
            ],
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Tên phòng là bắt buộc.',
            'name.unique' => 'Tên phòng đã tồn tại. Vui lòng nhập tên phòng không trùng hoặc thêm hậu tố phía sau!',
        ]);

        try {
            $room->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật phòng thành công!',
                'data' => $room,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể cập nhật phòng, vui lòng thử lại.',
            ], 422);
        }
    }


    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $result = $room->delete();

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa phòng thành công!'
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
        $multiRoom = $request->all();

        foreach ($multiRoom as $room) {
            $room = Room::findOrFail($room);
            $result = $room->delete();
        }

        if ($result) {
            return response()->json([
                'status' => 'success',
                'message' => 'Xóa phòng thành công!'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Xóa thất bại, vui lòng kiểm tra lại!'
            ], 201);
        }
    }
}
