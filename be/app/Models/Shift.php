<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shift extends Model
{
    use \App\Traits\Tenantable;

    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'start_time',
        'end_time',
        'color',
    ];

    protected $casts = [
        'start_time' => 'string',
        'end_time' => 'string',
    ];
}
