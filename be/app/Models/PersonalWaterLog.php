<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalWaterLog extends Model
{
    protected $guarded = ['id'];

    public function personalUser()
    {
        return $this->belongsTo(PersonalUser::class);
    }
}
