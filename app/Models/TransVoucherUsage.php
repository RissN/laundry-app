<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransVoucherUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_voucher',
        'id_order',
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'id_voucher');
    }

    public function order()
    {
        return $this->belongsTo(TransOrder::class, 'id_order');
    }
}
