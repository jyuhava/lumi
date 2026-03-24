<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealItem extends Model
{
    protected $table = 'meal_items';

    protected $fillable = [
        'meal_id',
        'food_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'decimal:2'
    ];

    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
