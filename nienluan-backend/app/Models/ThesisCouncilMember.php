<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisCouncilMember extends Model
{
    use HasFactory;

    protected $fillable = ['thesis_council_id', 'user_id', 'position'];

    public function council()
    {
        return $this->belongsTo(ThesisCouncil::class, 'thesis_council_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
