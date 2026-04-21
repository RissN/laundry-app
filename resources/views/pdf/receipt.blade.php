<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Struk {{ $order->order_code }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #000;
            width: 72mm;
            margin: 0 auto;
            padding: 4mm;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .separator {
            border-top: 1px dashed #000;
            margin: 6px 0;
        }
        .double-separator {
            border-top: 2px double #000;
            margin: 8px 0;
        }
        .header {
            text-align: center;
            margin-bottom: 6px;
        }
        .header h1 {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 2px;
        }
        .header h2 {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .header p {
            font-size: 9px;
            line-height: 1.4;
        }
        .info-row {
            display: table;
            width: 100%;
            margin-bottom: 2px;
        }
        .info-row .label {
            display: table-cell;
            width: 35%;
            font-size: 10px;
        }
        .info-row .value {
            display: table-cell;
            font-size: 10px;
            font-weight: bold;
        }
        .item {
            margin-bottom: 4px;
        }
        .item-name {
            font-weight: bold;
            font-size: 10px;
        }
        .item-detail {
            display: table;
            width: 100%;
        }
        .item-detail .qty {
            display: table-cell;
            font-size: 10px;
        }
        .item-detail .subtotal {
            display: table-cell;
            text-align: right;
            font-size: 10px;
            font-weight: bold;
        }
        .summary-row {
            display: table;
            width: 100%;
            margin-bottom: 2px;
        }
        .summary-row .label {
            display: table-cell;
            font-size: 10px;
        }
        .summary-row .value {
            display: table-cell;
            text-align: right;
            font-size: 10px;
        }
        .grand-total {
            display: table;
            width: 100%;
            margin: 4px 0;
        }
        .grand-total .label {
            display: table-cell;
            font-size: 13px;
            font-weight: bold;
        }
        .grand-total .value {
            display: table-cell;
            text-align: right;
            font-size: 13px;
            font-weight: bold;
        }
        .payment-info {
            border: 1px dashed #000;
            padding: 5px 6px;
            margin: 6px 0;
        }
        .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 9px;
            line-height: 1.5;
        }
        .footer .thank-you {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 3px;
        }
    </style>
</head>
<body>
    {{-- HEADER --}}
    <div class="header">
        <h1>LAUNDRIQ</h1>
        <p>Jl. Laundry Bersih No. 123<br>Telp: 0812-3456-7890</p>
        <div style="margin-top: 6px;"></div>
        @if($type === 'pickup')
            <h2>BUKTI PENGAMBILAN</h2>
        @else
            <h2>STRUK PENERIMAAN</h2>
        @endif
    </div>

    <div class="double-separator"></div>

    {{-- ORDER INFO --}}
    <div class="info-row">
        <span class="label">No. Order</span>
        <span class="value">: {{ $order->order_code }}</span>
    </div>
    <div class="info-row">
        <span class="label">Tanggal</span>
        <span class="value">: {{ \Carbon\Carbon::parse($order->order_date)->format('d/m/Y') }}</span>
    </div>
    @if($order->order_end_date)
    <div class="info-row">
        <span class="label">Tgl Selesai</span>
        <span class="value">: {{ \Carbon\Carbon::parse($order->order_end_date)->format('d/m/Y') }}</span>
    </div>
    @endif
    <div class="info-row">
        <span class="label">Pelanggan</span>
        <span class="value">: {{ $order->customer ? $order->customer->customer_name : $order->non_member_name }}</span>
    </div>
    @if(!$order->customer)
    <div class="info-row">
        <span class="label"></span>
        <span class="value" style="font-size:9px;">&nbsp; (NON-MEMBER)</span>
    </div>
    @endif
    @if($order->estimated_completion_date && $type !== 'pickup')
    <div class="info-row">
        <span class="label">Est. Selesai</span>
        <span class="value">: {{ \Carbon\Carbon::parse($order->estimated_completion_date)->format('d/m/Y') }}</span>
    </div>
    @endif
    <div class="info-row">
        <span class="label">Status</span>
        <span class="value">: {{ $order->payment_status == 1 ? 'LUNAS' : 'BELUM BAYAR' }}</span>
    </div>

    <div class="separator"></div>

    @if($type === 'pickup')
        {{-- PICKUP MODE --}}
        <div style="text-align: center; margin: 10px 0;">
            <p style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">CUCIAN TELAH DIAMBIL</p>
            <p style="font-size: 10px;">Terima kasih atas kepercayaan Anda.</p>
        </div>
    @else
        {{-- ITEMS FOR RECEIVE MODE --}}
        @foreach($order->details as $detail)
        <div class="item">
            <div class="item-name">{{ $detail->service->service_name ?? 'Layanan' }}</div>
            <div class="item-detail">
                <span class="qty">{{ $detail->qty }} Kg x Rp {{ number_format($detail->service->price ?? 0, 0, ',', '.') }}</span>
                <span class="subtotal">Rp {{ number_format($detail->subtotal, 0, ',', '.') }}</span>
            </div>
        </div>
        @endforeach

        @if($order->details->count() > 0 && $order->details->first()->notes)
        <div style="font-size:9px; margin-top:2px;">
            Catatan: {{ $order->details->first()->notes }}
        </div>
        @endif

        <div class="separator"></div>

        {{-- CALCULATION --}}
        @php
            $subtotalItems = $order->details->sum('subtotal');
        @endphp

        <div class="summary-row">
            <span class="label">Subtotal</span>
            <span class="value">Rp {{ number_format($subtotalItems, 0, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span class="label">Pajak (12%)</span>
            <span class="value">Rp {{ number_format($order->tax, 0, ',', '.') }}</span>
        </div>

        @if($order->discount_amount > 0)
        <div class="summary-row">
            <span class="label">Diskon ({{ $order->discount_percent }}%)</span>
            <span class="value">-Rp {{ number_format($order->discount_amount, 0, ',', '.') }}</span>
        </div>
        @endif

        @if($order->voucher)
        <div class="summary-row">
            <span class="label" style="font-size:9px;">Voucher: {{ $order->voucher->code }}</span>
            <span class="value"></span>
        </div>
        @endif

        <div class="double-separator"></div>

        {{-- GRAND TOTAL --}}
        <div class="grand-total">
            <span class="label">TOTAL</span>
            <span class="value">Rp {{ number_format($order->final_total ?? $order->total, 0, ',', '.') }}</span>
        </div>
    @endif

    {{-- PAYMENT INFO --}}
    @if($order->payment_status == 1 && $order->order_pay)
    <div class="payment-info">
        <div class="summary-row">
            <span class="label" style="font-weight:bold;">Bayar</span>
            <span class="value" style="font-weight:bold;">Rp {{ number_format($order->order_pay, 0, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span class="label" style="font-weight:bold;">Kembalian</span>
            <span class="value" style="font-weight:bold;">Rp {{ number_format($order->order_change ?? 0, 0, ',', '.') }}</span>
        </div>
    </div>
    @endif

    <div class="separator"></div>

    {{-- FOOTER --}}
    <div class="footer">
        <p class="thank-you">== Terima Kasih ==</p>
        <p>Simpan struk ini sebagai bukti<br>pengambilan cucian Anda.</p>
        <p style="margin-top:4px; font-size:8px;">
            Dicetak: {{ now()->format('d/m/Y H:i') }}
        </p>
    </div>
</body>
</html>
