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
            return back()->with('error', 'Order ini sudah diambil sebelumnya.');
        }

        $alreadyPaid = $order->payment_status == 1;
        $payableAmount = $order->final_total ?? $order->total;

        // Jika belum bayar, wajib input pembayaran
        if (!$alreadyPaid) {
            $request->validate([
                'order_pay' => 'required|numeric|min:' . $payableAmount,
                'notes' => 'nullable|string'
            ]);
        } else {
            $request->validate([
                'notes' => 'nullable|string'
            ]);
        }

        DB::beginTransaction();
        try {
            $updateData = [
                'order_end_date' => date('Y-m-d'),
                'order_status' => 1, // Selesai / Diambil
            ];

            if (!$alreadyPaid) {
                // Proses pembayaran saat pickup
                $order_pay = $request->order_pay;
                $order_change = $order_pay - $payableAmount;
                $updateData['order_pay'] = $order_pay;
                $updateData['order_change'] = $order_change;
                $updateData['payment_status'] = 1;
                $updateData['paid_at'] = now();
            }

            $order->update($updateData);

            // Create Pickup Record
            TransLaundryPickup::create([
                'id_order' => $order->id,
                'id_customer' => $order->id_customer,
                'pickup_date' => now(),
                'notes' => $request->notes,
            ]);

            DB::commit();

            if ($alreadyPaid) {
                return back()->with('success', 'Pengambilan berhasil diproses. (Sudah lunas sebelumnya)');
            }
            $order_change = $request->order_pay - $payableAmount;
            return back()->with('success', 'Pengambilan berhasil diproses. Kembalian: Rp ' . number_format($order_change, 0, ',', '.'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Pengambilan gagal: ' . $e->getMessage());
        }
    }
}
