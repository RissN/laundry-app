<?php

namespace App\Services;

class DiscountService
{
    /**
     * Calculate discount based on business rules:
     * - Registered customer automatically gets 5%.
     * - Voucher code without registered customer (new customer) -> 10%
     * - Registered customer + voucher code -> 15%
     *
     * @param bool $isRegisteredCustomer
     * @param bool $hasVoucher
     * @param int $subtotal
     * @return array
     */
    public function calculate(bool $isRegisteredCustomer, bool $hasVoucher, int $subtotal)
    {
        $discountPercent = 0;

        if ($isRegisteredCustomer && $hasVoucher) {
            $discountPercent = 15;
        } elseif ($hasVoucher) {
            $discountPercent = 10;
        } elseif ($isRegisteredCustomer) {
            $discountPercent = 5;
        }

        $discountAmount = round($subtotal * ($discountPercent / 100));
        $finalTotal = $subtotal - $discountAmount;

        return [
            'discount_percent' => $discountPercent,
            'discount_amount' => (int)$discountAmount,
            'final_total' => (int)$finalTotal,
        ];
    }
}
