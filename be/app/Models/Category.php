<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use \App\Traits\Tenantable;

    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];
}
