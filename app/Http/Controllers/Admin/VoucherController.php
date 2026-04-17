<?php

namespace App\Http\Controllers\Admin;

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

        return Inertia::render('Admin/Voucher/Index', compact('vouchers'));
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

        return redirect()->route('admin.voucher.index')->with('success', 'Voucher created successfully.');
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
}
