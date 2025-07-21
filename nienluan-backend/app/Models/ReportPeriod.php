<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'semester_id',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    // Quan hệ với Semester
    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function theses()
    {
        return $this->hasMany(Thesis::class);
    }
}
