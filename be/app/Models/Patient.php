<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use \App\Traits\Tenantable;

    protected $fillable = [
        'no_rm',
        'name',
        'age',
        'gender',
    ];

    public function nutritionalVisits()
    {
        return $this->hasMany(NutritionalVisit::class);
    }

    public function meals()
    {
        return $this->hasMany(Meal::class);
    }
}
