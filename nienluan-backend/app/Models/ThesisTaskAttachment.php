<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisTaskAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'thesis_task_id',
        'file_path',
        'file_name',
    ];

    public function thesisTask()
    {
        return $this->belongsTo(ThesisTask::class);
    }
}
