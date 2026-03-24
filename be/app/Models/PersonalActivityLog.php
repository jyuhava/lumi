<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalActivityLog extends Model
{
    protected $table = 'personal_activity_logs';

    protected $fillable = [
        'personal_user_id',
        'local_id',
        'entry_type',
        'activity_type',
        'name',
        'steps',
        'duration',
        'distance',
        'calories',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
            'steps'       => 'integer',
            'duration'    => 'integer',
            'distance'    => 'float',
            'calories'    => 'float',
        ];
    }

    public function user()
    {
        return $this->belongsTo(PersonalUser::class, 'personal_user_id');
    }
}
