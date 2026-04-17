<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\TransOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = TransOrder::with('customer')->orderBy('order_date', 'desc');

        if ($startDate && $endDate) {
            $query->whereBetween('order_date', [$startDate, $endDate]);
        }

        $orders = $query->paginate(20)->withQueryString();
        $totalRevenue = $query->where('order_status', 1)->sum(DB::raw('COALESCE(final_total, total)'));

        return Inertia::render('Pimpinan/Report/Index', [
            'orders' => $orders,
            'totalRevenue' => $totalRevenue,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
