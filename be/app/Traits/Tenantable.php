<?php

namespace App\Traits;

use App\Scopes\TenantScope;
use App\Services\TenantService;
use App\Models\Tenant;

trait Tenantable
{
    /**
     * Boot the trait.
     */
    protected static function bootTenantable()
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (!$model->tenant_id) {
                // Assign tenant_id automatically when creating new model, if TenantContext is set
                $tenantId = TenantService::getTenantId();
                if ($tenantId) {
                    $model->tenant_id = $tenantId;
                }
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
