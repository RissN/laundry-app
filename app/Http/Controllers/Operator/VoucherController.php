<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vouchers = Voucher::withCount('usages')
            ->latest()
            ->paginate(10);

        return Inertia::render('Operator/Voucher/Index', compact('vouchers'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code',
            'expires_at' => 'nullable|date',
        ]);

        Voucher::create([
            'code' => strtoupper($request->code),
            'is_active' => true,
            'expires_at' => $request->expires_at,
        ]);

        return redirect()->route('operator.voucher.index')->with('success', 'Voucher created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Voucher $voucher)
    {
        $voucher->update([
            'is_active' => !$voucher->is_active,
        ]);

        return back()->with('success', 'Voucher status updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return back()->with('success', 'Voucher deleted.');
    }

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
                'message' => 'Voucher code is invalid or inactive.',
            ], 404);
        }

        // Check for expiration
        if ($voucher->expires_at && $voucher->expires_at->isPast() && !$voucher->expires_at->isToday()) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher ini sudah kadaluarsa.',
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
