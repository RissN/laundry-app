<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'is_active',
        'expires_at',
        'usage_limit',
    ];

    protected $casts = [
        'expires_at' => 'date',
        'is_active' => 'boolean',
        'usage_limit' => 'integer',
    ];

    public function usages()
    {
        return $this->hasMany(TransVoucherUsage::class, 'id_voucher');
    }

    public function orders()
    {
        return $this->belongsToMany(TransOrder::class, 'trans_voucher_usages', 'id_voucher', 'id_order');
    }
}
