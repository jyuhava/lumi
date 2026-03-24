<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use \App\Traits\Tenantable;

    protected $table = 'meals';

    protected $fillable = [
        'tenant_id',
        'patient_id',
        'date',
        'meal_type',
    ];

    public function items()
    {
        return $this->hasMany(MealItem::class);
    }
    
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
