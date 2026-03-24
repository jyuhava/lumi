<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'subdomain',
        'status',
        'plan',
        'subscription_ends_at',
    ];

    protected $casts = [
        'subscription_ends_at' => 'datetime',
    ];
}
