<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thesis extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'report_period_id',
        'lecturer_id',
        'start_date',
        'end_date',
    ];

    public function attachments()
    {
        return $this->hasMany(ThesisAttachment::class);
    }

    public function reportPeriod()
    {
        return $this->belongsTo(ReportPeriod::class);
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function registrations()
    {
        return $this->hasMany(ThesisRegistration::class);
    }

    public function council()
    {
        return $this->hasOne(ThesisCouncil::class);
    }
}
