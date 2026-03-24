<?php

namespace App\Services;

class TenantService
{
    protected static $tenantId = null;

    public static function setTenantId($tenantId)
    {
        self::$tenantId = $tenantId;
    }

    public static function getTenantId()
    {
        return self::$tenantId;
    }
}
