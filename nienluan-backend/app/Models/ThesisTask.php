<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ThesisTask extends Model
{
    use HasFactory;

    protected $table = 'thesis_tasks';

    protected $fillable = [
        'thesis_id',
        'title',
        'description',
        'deadline',
        'status',
        'instructor_status',
        'instructor_note',
    ];

    /**
     * Liên kết với model Thesis
     */
    public function thesis()
    {
        return $this->belongsTo(Thesis::class);
    }

    public function attachments()
    {
        return $this->hasMany(ThesisTaskAttachment::class);
    }
}
