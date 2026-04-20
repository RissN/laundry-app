<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\TransOrder;
use App\Models\TransOrderDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Filter is mandatory — return empty data if not set
        if (!$startDate || !$endDate) {
            return Inertia::render('Pimpinan/Report/Index', [
                'orders' => ['data' => [], 'links' => [], 'meta' => []],
                'totalRevenue' => 0,
                'totalOrders' => 0,
                'completedOrders' => 0,
                'serviceStats' => [],
                'filters' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]);
        }

        $query = TransOrder::with('customer')->orderBy('order_date', 'desc');
        $query->whereBetween('order_date', [$startDate, $endDate]);

        $orders = $query->paginate(20)->withQueryString();

        // Clone a fresh query for aggregates
        $baseQuery = TransOrder::whereBetween('order_date', [$startDate, $endDate]);
        $totalRevenue = (clone $baseQuery)->where('order_status', 1)->sum(DB::raw('COALESCE(final_total, total)'));
        $totalOrders = (clone $baseQuery)->count();
        $completedOrders = (clone $baseQuery)->where('order_status', 1)->count();

        // Service statistics
        $serviceStats = TransOrderDetail::select(
                'type_of_services.service_name',
                DB::raw('COUNT(DISTINCT trans_order_details.id_order) as order_count'),
                DB::raw('SUM(trans_order_details.qty) as total_qty'),
                DB::raw('SUM(trans_order_details.subtotal) as total_revenue')
            )
            ->join('type_of_services', 'trans_order_details.id_service', '=', 'type_of_services.id')
            ->join('trans_orders', 'trans_order_details.id_order', '=', 'trans_orders.id')
            ->whereBetween('trans_orders.order_date', [$startDate, $endDate])
            ->whereNull('trans_orders.deleted_at')
            ->groupBy('type_of_services.id', 'type_of_services.service_name')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($item) {
                return [
                    'service_name' => $item->service_name,
                    'order_count' => (int) $item->order_count,
                    'total_qty' => (float) $item->total_qty,
                    'total_revenue' => (float) $item->total_revenue,
                ];
            })
            ->toArray();

        return Inertia::render('Pimpinan/Report/Index', [
            'orders' => $orders,
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'completedOrders' => $completedOrders,
            'serviceStats' => $serviceStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    public function exportPdf(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        if (!$startDate || !$endDate) {
            return back()->with('error', 'Pilih rentang tanggal terlebih dahulu.');
        }

        $orders = TransOrder::with('customer')
            ->whereBetween('order_date', [$startDate, $endDate])
            ->orderBy('order_date', 'desc')
            ->get();

        $baseQuery = TransOrder::whereBetween('order_date', [$startDate, $endDate]);
        $totalRevenue = (clone $baseQuery)->where('order_status', 1)->sum(DB::raw('COALESCE(final_total, total)'));
        $totalOrders = $orders->count();
        $completedOrders = $orders->where('order_status', 1)->count();

        $serviceStats = TransOrderDetail::select(
                'type_of_services.service_name',
                DB::raw('COUNT(DISTINCT trans_order_details.id_order) as order_count'),
                DB::raw('SUM(trans_order_details.qty) as total_qty'),
                DB::raw('SUM(trans_order_details.subtotal) as total_revenue')
            )
            ->join('type_of_services', 'trans_order_details.id_service', '=', 'type_of_services.id')
            ->join('trans_orders', 'trans_order_details.id_order', '=', 'trans_orders.id')
            ->whereBetween('trans_orders.order_date', [$startDate, $endDate])
            ->whereNull('trans_orders.deleted_at')
            ->groupBy('type_of_services.id', 'type_of_services.service_name')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(fn ($item) => [
                'service_name' => $item->service_name,
                'order_count' => (int) $item->order_count,
                'total_qty' => (float) $item->total_qty,
                'total_revenue' => (float) $item->total_revenue,
            ])
            ->toArray();

        $pdf = Pdf::loadView('pdf.report', compact(
            'orders', 'totalRevenue', 'totalOrders', 'completedOrders', 'serviceStats', 'startDate', 'endDate'
        ));

        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream("laporan-{$startDate}-{$endDate}.pdf");
    }
}
