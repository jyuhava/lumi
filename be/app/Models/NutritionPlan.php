<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionPlan extends Model
{
    use \App\Traits\Tenantable;

    protected $table = 'nutrition_plans';

    protected $fillable = [
        'tenant_id',
        'patient_id',
        'plan_name',
        'start_date',
        'end_date',
    ];

    public function items()
    {
        return $this->hasMany(NutritionPlanItem::class, 'plan_id');
    }
    
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
