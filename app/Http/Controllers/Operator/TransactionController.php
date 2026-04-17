<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\TypeOfService;
use App\Models\TransOrder;
use App\Models\TransOrderDetail;
use App\Models\Voucher;
use App\Models\TransVoucherUsage;
use App\Services\DiscountService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    const TAX_RATE = 0.10;
    protected $discountService;

    public function __construct(DiscountService $discountService)
    {
        $this->discountService = $discountService;
    }

    public function create()
    {
        $customers = Customer::all();
        $services = TypeOfService::all();
        return Inertia::render('Operator/Transaction/Create', compact('customers', 'services'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_customer' => 'nullable|exists:customers,id',
            'new_customer_name' => 'required_without:id_customer|string|nullable|max:255',
            'new_customer_phone' => 'required_without:id_customer|string|nullable|max:20',
            'new_customer_address' => 'required_without:id_customer|string|nullable',
            'items' => 'required|array|min:1',
            'items.*.id_service' => 'required|exists:type_of_services,id',
            'items.*.qty' => 'required|numeric|min:1',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
        ]);

        DB::beginTransaction();
        try {
            // Check if new customer inline creation
            $customerId = $request->id_customer;
            if (!$customerId) {
                $newCustomer = Customer::create([
                    'customer_name' => $request->new_customer_name,
                    'phone' => $request->new_customer_phone,
                    'address' => $request->new_customer_address,
                ]);
                $customerId = $newCustomer->id;
            }

            // Generate Order Code (e.g. ORD-YYYYMMDD-001)
            $today = date('Ymd');
            $latestOrder = TransOrder::whereDate('created_at', date('Y-m-d'))->latest('id')->first();
            $number = $latestOrder ? intval(substr($latestOrder->order_code, -3)) + 1 : 1;
            $orderCode = 'ORD-' . $today . '-' . str_pad($number, 3, '0', STR_PAD_LEFT);

            // Calculate subtotal and tax
            $subtotalAll = 0;
            $detailsData = [];
            foreach ($request->items as $item) {
                $service = TypeOfService::findOrFail($item['id_service']);
                $subtotal = $service->price * $item['qty'];
                $subtotalAll += $subtotal;
                $detailsData[] = [
                    'id_service' => $service->id,
                    'qty' => $item['qty'],
                    'subtotal' => $subtotal,
                    'notes' => $item['notes'] ?? '',
                ];
            }

            $taxRate = self::TAX_RATE;
            $taxAmount = round($subtotalAll * $taxRate);
            $totalBeforeDiscount = $subtotalAll + $taxAmount;

            // Handle Discount Logic
            $isRegisteredCustomer = $request->has('id_customer') && $request->id_customer !== null;
            $voucher = null;
            if ($request->voucher_code) {
                $voucher = Voucher::where('code', strtoupper($request->voucher_code))
                    ->where('is_active', true)
                    ->first();
            }

            $discountData = $this->discountService->calculate(
                $isRegisteredCustomer,
                $voucher !== null,
                $totalBeforeDiscount
            );

            // Create Order
            $order = TransOrder::create([
                'id_customer' => $customerId,
                'id_voucher' => $voucher ? $voucher->id : null,
                'order_code' => $orderCode,
                'order_date' => date('Y-m-d'),
                'order_status' => 0,
                'tax' => $taxAmount,
                'total' => $totalBeforeDiscount,
                'discount_percent' => $discountData['discount_percent'],
                'discount_amount' => $discountData['discount_amount'],
                'final_total' => $discountData['final_total'],
            ]);

            // Record Voucher Usage
            if ($voucher) {
                TransVoucherUsage::create([
                    'id_voucher' => $voucher->id,
                    'id_order' => $order->id,
                ]);

                // "Voucher sekali pakai, langsung hangus"
                $voucher->update(['is_active' => false]);
            }

            // Create Details
            foreach ($detailsData as $detail) {
                $detail['id_order'] = $order->id;
                TransOrderDetail::create($detail);
            }

            DB::commit();
            return redirect()->route('operator.pickup.index')->with('success', "Order $orderCode created successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Transaction failed: ' . $e->getMessage());
        }
    }
}
