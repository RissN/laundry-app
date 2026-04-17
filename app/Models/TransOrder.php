<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransOrder extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'id_customer');
    }

    public function details()
    {
        return $this->hasMany(TransOrderDetail::class, 'id_order');
    }

    public function pickup()
    {
        return $this->hasOne(TransLaundryPickup::class, 'id_order');
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'id_voucher');
    }

    public function voucherUsage()
    {
        return $this->hasOne(TransVoucherUsage::class, 'id_order');
    }
}
