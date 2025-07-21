<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'thesis_id',
        'status',
        'reject_note'
    ];

    public function thesis()
    {
        return $this->belongsTo(Thesis::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'thesis_registration_student', 'thesis_registration_id', 'student_id');
    }
}
