<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Validate voucher code for checkout.
     */
    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'id_customer' => 'nullable|exists:customers,id',
        ]);

        $voucher = Voucher::where('code', strtoupper($request->code))
            ->where('is_active', true)
            ->first();

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Kode voucher tidak valid atau sudah tidak aktif.',
            ], 404);
        }

        // Check for expiration
        if ($voucher->expires_at && $voucher->expires_at->isPast() && !$voucher->expires_at->isToday()) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher ini sudah kadaluarsa.',
            ], 422);
        }

        // Check for usage limit
        if ($voucher->usage_limit && $voucher->usages()->count() >= $voucher->usage_limit) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher ini sudah mencapai batas pemakaian.',
            ], 422);
        }

        if ($request->id_customer) {
            $alreadyUsed = \App\Models\TransVoucherUsage::where('id_voucher', $voucher->id)
                ->whereHas('order', function($q) use ($request) {
                    $q->where('id_customer', $request->id_customer);
                })->exists();
            
            if ($alreadyUsed) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah pernah menggunakan voucher ini.',
                ], 422);
            }
        }

        return response()->json([
            'success' => true,
            'voucher' => $voucher,
        ]);
    }
}
