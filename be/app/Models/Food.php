<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Food extends Model
{
    use \App\Traits\Tenantable;
    use SoftDeletes;

    protected $table = 'foods';

    protected $fillable = [
        'tenant_id',
        'name',
        'category',
        'food_group',
        'source',
        'barcode',
        'description',
        'energy',
        'protein',
        'fat',
        'carbohydrate',
        'fiber',
        'sugar',
        'sodium',
        'calcium',
        'iron',
        'vitamin_a',
        'vitamin_b',
        'vitamin_c',
        'is_verified'
    ];

    protected $casts = [
        'energy' => 'decimal:2',
        'protein' => 'decimal:2',
        'fat' => 'decimal:2',
        'carbohydrate' => 'decimal:2',
        'fiber' => 'decimal:2',
        'sugar' => 'decimal:2',
        'sodium' => 'decimal:2',
        'calcium' => 'decimal:2',
        'iron' => 'decimal:2',
        'vitamin_a' => 'decimal:2',
        'vitamin_b' => 'decimal:2',
        'vitamin_c' => 'decimal:2',
        'is_verified' => 'boolean'
    ];
}
