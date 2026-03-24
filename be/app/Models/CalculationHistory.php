<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculationHistory extends Model
{
    use \App\Traits\Tenantable;

    protected $fillable = [
        'tenant_id',
        'patient_id',
        'weight',
        'height',
        'age',
        'gender',
        'bmr',
        'tee',
        'requirements'
    ];

    protected $casts = [
        'requirements' => 'array',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
