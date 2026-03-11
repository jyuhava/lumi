<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
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
}
