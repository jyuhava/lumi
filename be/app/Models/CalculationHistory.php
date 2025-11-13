<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalculationHistory extends Model
{
    protected $table = 'calculation_history';

    protected $fillable = [
        'user_id',
        'calculator_type',
        'method',
        'inputs',
        'results',
        'notes',
    ];

    protected $casts = [
        'inputs' => 'array',
        'results' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
