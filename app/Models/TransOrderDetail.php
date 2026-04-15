<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransOrderDetail extends Model
{
    protected $guarded = ['id'];

    public function order()
    {
        return $this->belongsTo(TransOrder::class, 'id_order');
    }

    public function service()
    {
        return $this->belongsTo(TypeOfService::class, 'id_service');
    }
}
