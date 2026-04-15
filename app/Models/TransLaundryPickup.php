<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransLaundryPickup extends Model
{
    protected $guarded = ['id'];

    public function order()
    {
        return $this->belongsTo(TransOrder::class, 'id_order');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'id_customer');
    }
}
