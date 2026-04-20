<?php

namespace App\Http\Controllers;

use App\Models\TransOrder;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptController extends Controller
{
    public function show(TransOrder $order, \Illuminate\Http\Request $request)
    {
        $order->load(['customer', 'details.service', 'voucher']);
        $type = $request->query('type', 'receive'); // default to 'receive'

        $pdf = Pdf::loadView('pdf.receipt', compact('order', 'type'));

        // Thermal printer: 80mm width, auto height
        $pdf->setPaper([0, 0, 226.77, 600], 'portrait'); // 80mm = 226.77pt

        return $pdf->stream("struk-{$order->order_code}.pdf");
    }
}
