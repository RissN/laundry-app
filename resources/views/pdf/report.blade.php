<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Penjualan</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 11px;
            color: #1f2937;
            padding: 20px 25px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #0284c7;
        }
        .header h1 {
            font-size: 22px;
            font-weight: bold;
            color: #0284c7;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .header h2 {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 6px;
        }
        .header .period {
            font-size: 11px;
            color: #6b7280;
            background: #f0f9ff;
            display: inline-block;
            padding: 4px 14px;
            border-radius: 12px;
            border: 1px solid #bae6fd;
        }
        .summary-box {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 18px;
            display: table;
            width: 100%;
        }
        .summary-item {
            display: table-cell;
            text-align: center;
            padding: 0 10px;
        }
        .summary-item .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 3px;
        }
        .summary-item .value {
            font-size: 16px;
            font-weight: bold;
            color: #0284c7;
        }
        .summary-item .value.green { color: #059669; }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #1f2937;
            margin: 16px 0 8px;
            padding-bottom: 4px;
            border-bottom: 2px solid #e5e7eb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        table th {
            background: #0284c7;
            color: white;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            padding: 7px 8px;
            text-align: left;
        }
        table th.right { text-align: right; }
        table th.center { text-align: center; }
        table td {
            padding: 6px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
        }
        table td.right { text-align: right; }
        table td.center { text-align: center; }
        table tr:nth-child(even) { background: #f9fafb; }
        table td.mono {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 9px;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-info { background: #e0f2fe; color: #075985; }
        .stat-bar-container {
            margin-bottom: 14px;
        }
        .stat-bar-row {
            margin-bottom: 8px;
        }
        .stat-bar-label {
            display: table;
            width: 100%;
            margin-bottom: 3px;
        }
        .stat-bar-label .name {
            display: table-cell;
            font-size: 10px;
            font-weight: 600;
            color: #374151;
        }
        .stat-bar-label .val {
            display: table-cell;
            text-align: right;
            font-size: 10px;
            font-weight: bold;
            color: #0284c7;
        }
        .stat-bar-bg {
            background: #e5e7eb;
            border-radius: 4px;
            height: 10px;
            width: 100%;
            overflow: hidden;
        }
        .stat-bar-fill {
            height: 10px;
            border-radius: 4px;
        }
        .bar-sky { background: #0284c7; }
        .bar-emerald { background: #059669; }
        .bar-amber { background: #d97706; }
        .bar-purple { background: #7c3aed; }
        .bar-rose { background: #e11d48; }
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
        }
        .stats-table td { font-size: 10px; }
        .stats-table td.bold { font-weight: bold; }
    </style>
</head>
<body>
    {{-- HEADER --}}
    <div class="header">
        <h1>LAUNDRIQ</h1>
        <h2>Laporan Penjualan</h2>
        <span class="period">
            Periode: {{ \Carbon\Carbon::parse($startDate)->format('d M Y') }} — {{ \Carbon\Carbon::parse($endDate)->format('d M Y') }}
        </span>
    </div>

    {{-- SUMMARY --}}
    <div class="summary-box">
        <div class="summary-item">
            <div class="label">Total Transaksi</div>
            <div class="value">{{ $totalOrders }}</div>
        </div>
        <div class="summary-item">
            <div class="label">Selesai</div>
            <div class="value green">{{ $completedOrders }}</div>
        </div>
        <div class="summary-item">
            <div class="label">Diproses</div>
            <div class="value" style="color:#d97706;">{{ $totalOrders - $completedOrders }}</div>
        </div>
        <div class="summary-item">
            <div class="label">Total Pendapatan</div>
            <div class="value green">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</div>
        </div>
    </div>

    {{-- TRANSACTION TABLE --}}
    <div class="section-title">Detail Transaksi</div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Status</th>
                <th>Kode</th>
                <th>Tgl Masuk</th>
                <th>Tgl Selesai</th>
                <th>Pelanggan</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $i => $order)
            <tr>
                <td class="center">{{ $i + 1 }}</td>
                <td class="center">
                    @if($order->order_status == 1)
                        <span class="badge badge-success">Selesai</span>
                    @else
                        <span class="badge badge-warning">Diproses</span>
                    @endif
                </td>
                <td class="mono">{{ $order->order_code }}</td>
                <td>{{ \Carbon\Carbon::parse($order->order_date)->format('d/m/Y') }}</td>
                <td>
                    {{ $order->order_end_date ? \Carbon\Carbon::parse($order->order_end_date)->format('d/m/Y') : '-' }}
                    @if($order->order_status == 1 && $order->order_end_date && $order->estimated_completion_date)
                        @if(\Carbon\Carbon::parse($order->order_end_date)->startOfDay()->lte(\Carbon\Carbon::parse($order->estimated_completion_date)->startOfDay()))
                            <br><span class="badge badge-success" style="font-size:7px;">TEPAT</span>
                        @else
                            <br><span class="badge" style="background:#fee2e2; color:#9f1239; font-size:7px;">TELAT</span>
                        @endif
                    @endif
                </td>
                <td>
                    {{ $order->customer ? $order->customer->customer_name : $order->non_member_name }}
                    @if(!$order->customer)
                        <span class="badge badge-warning" style="font-size:7px;">NON-MEMBER</span>
                    @endif
                </td>
                <td class="right" style="font-weight:bold; color:#e11d48;">
                    Rp {{ number_format($order->final_total ?? $order->total, 0, ',', '.') }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align:center; padding:20px; color:#9ca3af;">Tidak ada data transaksi.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    {{-- SERVICE STATISTICS --}}
    @if(count($serviceStats) > 0)
    <div class="section-title">Statistik Layanan</div>
    <table class="stats-table">
        <thead>
            <tr>
                <th>Layanan</th>
                <th class="center">Jumlah Order</th>
                <th class="center">Total Berat (Kg)</th>
                <th class="right">Total Pendapatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($serviceStats as $stat)
            <tr>
                <td class="bold">{{ $stat['service_name'] }}</td>
                <td class="center">{{ $stat['order_count'] }} order</td>
                <td class="center">{{ number_format($stat['total_qty'], 1) }} Kg</td>
                <td class="right bold" style="color:#059669;">Rp {{ number_format($stat['total_revenue'], 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- VISUAL BAR CHART --}}
    <div style="margin-top: 10px;">
        <p style="font-size:10px; font-weight:bold; color:#6b7280; margin-bottom:8px;">Pendapatan per Layanan</p>
        @php $maxRevenue = collect($serviceStats)->max('total_revenue') ?: 1; @endphp
        <div class="stat-bar-container">
            @php
                $barColors = ['bar-sky', 'bar-emerald', 'bar-amber', 'bar-purple', 'bar-rose'];
            @endphp
            @foreach($serviceStats as $idx => $stat)
            <div class="stat-bar-row">
                <div class="stat-bar-label">
                    <span class="name">{{ $stat['service_name'] }}</span>
                    <span class="val">Rp {{ number_format($stat['total_revenue'], 0, ',', '.') }}</span>
                </div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill {{ $barColors[$idx % count($barColors)] }}" style="width: {{ round(($stat['total_revenue'] / $maxRevenue) * 100) }}%;"></div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    {{-- FOOTER --}}
    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }} — LaundriQ Management System</p>
    </div>
</body>
</html>
