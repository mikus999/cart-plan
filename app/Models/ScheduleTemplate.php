<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleTemplate extends Model
{
    protected $fillable = [
        'name'
    ];

    public function team()
    {
        return $this->belongsTo('App\Models\Team');
    }

    public function schedule()
    {
        return $this->belongsTo('App\Models\Schedule');
    }
}
