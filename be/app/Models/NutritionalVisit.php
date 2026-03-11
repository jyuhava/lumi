<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionalVisit extends Model
{
    protected $fillable = [
        'patient_id',
        'nutritionist_id',
        'visit_date',
        'admission_date',
        'room_number',
        'medical_diagnosis',
        'diet_prescription',
        'weight',
        'height',
        'bmi',
        'nutritional_status',
        'malnutrition_risk',
        'remarks',
        'is_emr_filled',
        'is_educated',
        'is_care_provided',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'admission_date' => 'date',
        'is_emr_filled' => 'boolean',
        'is_educated' => 'boolean',
        'is_care_provided' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function nutritionist()
    {
        return $this->belongsTo(User::class, 'nutritionist_id');
    }
}
