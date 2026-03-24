<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionPlanItem extends Model
{
    protected $table = 'nutrition_plan_items';

    protected $fillable = [
        'plan_id',
        'food_id',
        'day_of_week',
        'meal_type',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'decimal:2'
    ];

    public function plan()
    {
        return $this->belongsTo(NutritionPlan::class, 'plan_id');
    }

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
