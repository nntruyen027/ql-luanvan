<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'thesis_id',
        'date',
        'start_time',
        'end_time',
        'session', 
    ];

    protected $appends = ['session'];

    public function getSessionAttribute()
    {
        $hour = Carbon::parse($this->start_time)->hour;

        if ($hour < 12) return 'sáng';
        if ($hour < 18) return 'chiều';
        return 'tối';
    }

    public function thesis()
    {
        return $this->belongsTo(Thesis::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
