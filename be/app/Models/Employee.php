<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_id',
        'name',
        'position',
        'preferred_shifts',
        'phone',
        'email',
        'address',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
        'preferred_shifts' => 'array',
    ];
}
