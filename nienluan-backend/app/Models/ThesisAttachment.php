<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'thesis_id',
        'file_path',
        'file_name',
    ];

    public function thesis()
    {
        return $this->belongsTo(Thesis::class);
    }
}
