<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\TransOrder;
use App\Models\TransLaundryPickup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PickupController extends Controller
{
    public function index()
    {
        $orders = TransOrder::with(['customer', 'details.service'])
            ->where('order_status', 0)
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Operator/Pickup/Index', compact('orders'));
    }

    public function store(Request $request, TransOrder $order)
    {
        if ($order->order_status != 0) {
            return back()->with('error', 'Order has already been picked up.');
        }

        $request->validate([
            'order_pay' => 'required|numeric|min:' . $order->total,
            'notes' => 'nullable|string'
        ]);

        $order_pay = $request->order_pay;
        $order_change = $order_pay - $order->total;

        DB::beginTransaction();
        try {
            // Update order
            $order->update([
                'order_end_date' => date('Y-m-d'),
                'order_status' => 1, // Selesai / Diambil
                'order_pay' => $order_pay,
                'order_change' => $order_change,
            ]);

            // Create Pickup Record
            TransLaundryPickup::create([
                'id_order' => $order->id,
                'id_customer' => $order->id_customer,
                'pickup_date' => now(),
                'notes' => $request->notes,
            ]);

            DB::commit();
            return back()->with('success', 'Order picked up and payment processed successfully. Change: Rp ' . number_format($order_change, 0, ',', '.'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Pickup failed: ' . $e->getMessage());
        }
    }
}
