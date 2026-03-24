<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use App\Services\TenantService;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = TenantService::getTenantId();

        if ($tenantId) {
            $builder->where($model->getTable() . '.tenant_id', $tenantId);
        } else {
            // Jika request masuk bukan dari CLI / Command dan tenant_id null, block akses total
            if (php_sapi_name() !== 'cli') {
                $builder->where($model->getTable() . '.tenant_id', -9999);
            }
        }
    }
}
