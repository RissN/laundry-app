<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use App\Models\TypeOfService;
use App\Models\TransOrder;
use App\Models\TransLaundryPickup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = auth()->user();
        $userLevel = $user->id_level;
        $stats = [];
        $extraData = [];

        if ($userLevel == 1) { // Admin
            $stats = [
                'total_customers' => Customer::count(),
                'total_users'     => User::count(),
                'total_services'  => TypeOfService::count(),
            ];
        } elseif ($userLevel == 2) { // Operator
            $stats = [
                'orders_today'    => TransOrder::whereDate('order_date', date('Y-m-d'))->count(),
                'pending_pickups' => TransOrder::doesntHave('pickup')->count(),
            ];
            
            $extraData['recent_transactions'] = TransOrder::with('customer')
                ->latest()
                ->take(5)
                ->get();
        } elseif ($userLevel == 3) { // Pimpinan
            $stats = [
                'monthly_revenue' => (int) TransOrder::whereMonth('order_date', date('m'))
                    ->whereYear('order_date', date('Y'))
                    ->where('order_status', 1)
                    ->sum(DB::raw('COALESCE(final_total, total)')),
                'monthly_orders' => TransOrder::whereMonth('order_date', date('m'))
                    ->whereYear('order_date', date('Y'))
                    ->count(),
            ];

            $extraData['recent_sales'] = TransOrder::with('customer')
                ->where('order_status', 1)
                ->latest('order_end_date')
                ->take(10)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'extraData' => $extraData
        ]);
    }
}
