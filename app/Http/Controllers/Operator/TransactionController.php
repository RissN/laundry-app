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
        $customers = Customer::withCount('orders')->get();
        $services = TypeOfService::all();
        $activeQueueCount = TransOrder::where('order_status', 0)->count();
        return Inertia::render('Operator/Transaction/Create', compact('customers', 'services', 'activeQueueCount'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_customer' => 'nullable|exists:customers,id',
            'new_customer_name' => 'required_without_all:id_customer,non_member_name|string|nullable|max:255',
            'new_customer_phone' => 'required_without_all:id_customer,non_member_name|string|nullable|max:20',
            'new_customer_address' => 'required_without_all:id_customer,non_member_name|string|nullable',
            'items' => 'required|array|min:1',
            'items.*.id_service' => 'required|exists:type_of_services,id',
            'items.*.qty' => 'required|numeric|min:1',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
            'is_non_member' => 'nullable|boolean',
            'non_member_name' => 'required_if:is_non_member,true|string|nullable|max:255',
            'non_member_phone' => 'required_if:is_non_member,true|string|nullable|max:20',
            'payment_method' => 'required|in:pay_later,pay_now',
            'order_pay' => 'nullable|numeric|min:0',
            'estimated_completion_date' => 'nullable|date',
        ]);

        DB::beginTransaction();
        try {
            // Check if non-member or member
            $customerId = null;
            $nonMemberName = null;
            $nonMemberPhone = null;

            $isWelcomeDiscountEligible = false;

            if ($request->is_non_member) {
                $nonMemberName = $request->non_member_name;
                $nonMemberPhone = $request->non_member_phone;
            } else {
                $customerId = $request->id_customer;
                if (!$customerId) {
                    $newCustomer = Customer::create([
                        'customer_name' => $request->new_customer_name,
                        'phone' => $request->new_customer_phone,
                        'address' => $request->new_customer_address,
                    ]);
                    $customerId = $newCustomer->id;
                    $isWelcomeDiscountEligible = true; // New registration always gets welcome discount
                } else {
                    // Check if existing customer has ever made an order
                    $orderCount = TransOrder::where('id_customer', $customerId)->count();
                    $isWelcomeDiscountEligible = ($orderCount === 0);
                }
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
            // If it's not a non-member, it's either an existing member or a new member being registered.
            $isRegisteredCustomer = !$request->is_non_member;
            $voucher = null;
            if ($request->voucher_code) {
                $voucher = Voucher::where('code', strtoupper($request->voucher_code))
                    ->where('is_active', true)
                    ->first();
            }

            $discountData = $this->discountService->calculate(
                $isWelcomeDiscountEligible,
                $voucher !== null,
                $totalBeforeDiscount
            );

            // Handle Payment Method
            $payNow = $request->payment_method === 'pay_now';
            $finalTotal = $discountData['final_total'];
            $orderPay = null;
            $orderChange = null;
            $paymentStatus = 0;
            $paidAt = null;

            if ($payNow && $request->order_pay) {
                $orderPay = $request->order_pay;
                $orderChange = $orderPay - $finalTotal;
                if ($orderChange < 0) {
                    throw new \Exception('Uang yang dibayarkan kurang dari total tagihan.');
                }
                $paymentStatus = 1;
                $paidAt = now();
            }

            // Create Order
            $order = TransOrder::create([
                'id_customer' => $customerId,
                'non_member_name' => $nonMemberName,
                'non_member_phone' => $nonMemberPhone,
                'id_voucher' => $voucher ? $voucher->id : null,
                'order_code' => $orderCode,
                'order_date' => date('Y-m-d'),
                'estimated_completion_date' => $request->estimated_completion_date,
                'order_status' => 0,
                'payment_status' => $paymentStatus,
                'paid_at' => $paidAt,
                'tax' => $taxAmount,
                'total' => $totalBeforeDiscount,
                'discount_percent' => $discountData['discount_percent'],
                'discount_amount' => $discountData['discount_amount'],
                'final_total' => $finalTotal,
                'order_pay' => $orderPay,
                'order_change' => $orderChange,
            ]);

            // Record Voucher Usage
            if ($voucher) {
                TransVoucherUsage::create([
                    'id_voucher' => $voucher->id,
                    'id_order' => $order->id,
                ]);
            }

            // Create Details
            foreach ($detailsData as $detail) {
                $detail['id_order'] = $order->id;
                TransOrderDetail::create($detail);
            }

            DB::commit();
            $successMsg = "Order $orderCode berhasil dibuat.";
            if ($payNow) {
                $successMsg .= " Pembayaran lunas. Kembalian: Rp " . number_format($orderChange, 0, ',', '.');
            }
            return redirect()->route('operator.pickup.index')->with([
                'success' => $successMsg,
                'new_order_id' => $order->id,
                'new_order_code' => $orderCode,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Transaksi gagal: ' . $e->getMessage());
        }
    }
}
