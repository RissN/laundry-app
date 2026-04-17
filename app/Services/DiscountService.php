<?php

namespace App\Services;

class DiscountService
{
    /**
     * Calculate discount based on business rules:
     * - First Order (Welcome Discount) gets 5%.
     * - Voucher code without Welcome Discount eligibility -> 10%
     * - First Order + voucher code -> 15%
     *
     * @param bool $isWelcomeDiscountEligible
     * @param bool $hasVoucher
     * @param int $subtotal
     * @return array
     */
    public function calculate(bool $isWelcomeDiscountEligible, bool $hasVoucher, int $subtotal)
    {
        $discountPercent = 0;

        if ($isWelcomeDiscountEligible && $hasVoucher) {
            $discountPercent = 15;
        } elseif ($hasVoucher) {
            $discountPercent = 10;
        } elseif ($isWelcomeDiscountEligible) {
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
