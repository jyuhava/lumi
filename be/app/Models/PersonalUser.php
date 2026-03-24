<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * PersonalUser – pengguna pribadi (non-nakes) untuk aplikasi LumiFit.
 * Model ini sengaja dibuat terpisah dari User (nakes) agar tidak tumpang tindih
 * dan tidak memerlukan tenant_id.
 */
class PersonalUser extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'personal_users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'birth_date',
        'height_cm',
        'weight_kg',
        'blood_type',
        'activity_level',
        'target_weight_kg',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'   => 'hashed',
            'birth_date' => 'date',
        ];
    }
}
