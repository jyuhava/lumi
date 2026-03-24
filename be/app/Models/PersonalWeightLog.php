<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalWeightLog extends Model
{
    protected $table = 'personal_weight_logs';

    protected $fillable = [
        'personal_user_id',
        'local_id',
        'weight',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
            'weight'      => 'float',
        ];
    }

    public function user()
    {
        return $this->belongsTo(PersonalUser::class, 'personal_user_id');
    }
}
