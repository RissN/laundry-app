import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileDown, Printer, Filter, CalendarRange, BarChart3, TrendingUp, ClipboardList, CheckCircle } from 'lucide-react';

export default function Index({ orders, totalRevenue, totalOrders, completedOrders, serviceStats, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
    });

    const hasFilter = filters.start_date && filters.end_date;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    const handleFilter = (e) => {
        e.preventDefault();
        if (!data.start_date || !data.end_date) {
            import('sweetalert2').then((Swal) => {
                Swal.default.fire({
                    icon: 'warning',
                    title: 'Filter Wajib',
                    text: 'Silakan pilih tanggal awal dan tanggal akhir terlebih dahulu.',
                    confirmButtonColor: '#0284c7',
                });
            });
            return;
        }
        get(route('pimpinan.report.index'));
    }

    const resetFilter = () => {
        router.get(route('pimpinan.report.index'));
    }

    const handleExportPdf = () => {
        window.open(`/pimpinan/report/pdf?start_date=${filters.start_date}&end_date=${filters.end_date}`, '_blank');
    }

    const handlePrintReceipt = (orderId) => {
        window.open(`/receipt/${orderId}`, '_blank');
    }

    const maxRevenue = serviceStats.length > 0
        ? Math.max(...serviceStats.map(s => s.total_revenue))
        : 1;

    const barColors = [
        { bg: 'bg-sky-500', text: 'text-sky-700', light: 'bg-sky-50' },
        { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50' },
        { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50' },
        { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50' },
        { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50' },
    ];

    return (
        <AuthenticatedLayout header="Laporan Penjualan Laundry">
            <Head title="Laporan Penjualan" />
            
            {/* Filter Card - Always Visible */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                        <CalendarRange size={18} />
                    </div>
                    <div>
                        <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Filter Laporan</h4>
                        <p className="text-xs text-gray-400">Pilih rentang tanggal untuk menampilkan laporan</p>
                    </div>
                </div>
                <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">Dari Tanggal <span className="text-rose-500">*</span></label>
                        <input 
                            type="date" 
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                            className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                            required
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">Sampai Tanggal <span className="text-rose-500">*</span></label>
                        <input 
                            type="date" 
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                            className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                            required
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button type="submit" disabled={processing} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 justify-center">
                            <Filter size={14} />
                            Filter
                        </button>
                        {hasFilter && (
                            <button type="button" onClick={resetFilter} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-lg border border-gray-200 transition-colors text-sm">
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Empty state when no filter */}
            {!hasFilter && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-300 flex items-center justify-center mb-4">
                        <CalendarRange size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-1">Pilih Rentang Tanggal</h3>
                    <p className="text-sm text-gray-400 max-w-md">Untuk menampilkan laporan penjualan, silakan isi filter tanggal awal dan akhir di atas, lalu klik tombol <strong>Filter</strong>.</p>
                </div>
            )}

            {/* Content - Only shown when filter is active */}
            {hasFilter && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                        <div className="bg-sky-600 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp size={18} className="text-sky-200" />
                                <p className="text-sky-100 font-medium uppercase text-xs">Total Pendapatan</p>
                            </div>
                            <h3 className="text-white text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <ClipboardList size={18} className="text-gray-400" />
                                <p className="text-gray-500 font-medium uppercase text-xs">Total Order</p>
                            </div>
                            <h3 className="text-gray-900 text-2xl font-bold">{totalOrders}</h3>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle size={18} className="text-emerald-500" />
                                <p className="text-gray-500 font-medium uppercase text-xs">Selesai</p>
                            </div>
                            <h3 className="text-emerald-600 text-2xl font-bold">{completedOrders}</h3>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <FileDown size={18} className="text-sky-500" />
                                <p className="text-gray-500 font-medium uppercase text-xs">Export</p>
                            </div>
                            <button
                                onClick={handleExportPdf}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors text-xs flex items-center gap-2"
                            >
                                <FileDown size={14} />
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Service Statistics Bar Chart */}
                    {serviceStats.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-5">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <BarChart3 size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Statistik Layanan</h3>
                                    <p className="text-xs text-gray-400">Performa layanan dalam periode yang dipilih</p>
                                </div>
                            </div>
                            <div className="p-5">
                                {/* Bar Chart */}
                                <div className="space-y-4 mb-6">
                                    {serviceStats.map((stat, idx) => {
                                        const color = barColors[idx % barColors.length];
                                        const widthPercent = Math.max((stat.total_revenue / maxRevenue) * 100, 3);
                                        return (
                                            <div key={idx}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-bold text-gray-700">{stat.service_name}</span>
                                                    <span className={`text-sm font-bold ${color.text}`}>{formatCurrency(stat.total_revenue)}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
                                                    <div
                                                        className={`${color.bg} h-5 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                                        style={{ width: `${widthPercent}%` }}
                                                    >
                                                        {widthPercent > 20 && (
                                                            <span className="text-white text-xs font-bold">{stat.order_count} order</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 mt-1">
                                                    <span className="text-xs text-gray-400 font-medium">{stat.order_count} order</span>
                                                    <span className="text-xs text-gray-400 font-medium">{stat.total_qty.toFixed(1)} Kg</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Stats Table */}
                                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs font-semibold">
                                            <tr>
                                                <th className="px-4 py-2.5">Layanan</th>
                                                <th className="px-4 py-2.5 text-center">Jumlah Order</th>
                                                <th className="px-4 py-2.5 text-center">Total Berat</th>
                                                <th className="px-4 py-2.5 text-right">Pendapatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {serviceStats.map((stat, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2.5 font-bold text-gray-700">{stat.service_name}</td>
                                                    <td className="px-4 py-2.5 text-center text-gray-600">{stat.order_count} order</td>
                                                    <td className="px-4 py-2.5 text-center text-gray-600">{stat.total_qty.toFixed(1)} Kg</td>
                                                    <td className="px-4 py-2.5 text-right font-bold text-emerald-600">{formatCurrency(stat.total_revenue)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transaction Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-800">Detail Transaksi</h3>
                            <span className="text-xs text-gray-400 font-medium">{orders.data?.length || 0} data ditampilkan</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wide text-xs font-semibold">
                                    <tr>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Kode Transaksi</th>
                                        <th className="px-5 py-3">Tgl Masuk</th>
                                        <th className="px-5 py-3">Tgl Selesai</th>
                                        <th className="px-5 py-3">Pelanggan</th>
                                        <th className="px-5 py-3 text-right">Total Transaksi</th>
                                        <th className="px-5 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(orders.data || []).map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3">
                                                <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${order.order_status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {order.order_status === 1 ? 'Selesai' : 'Diproses'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="font-mono font-bold text-gray-700 text-xs">{order.order_code}</span>
                                            </td>
                                            <td className="px-5 py-3 font-mono text-gray-500">{order.order_date}</td>
                                            <td className="px-5 py-3 font-mono text-gray-500">
                                                <div className="flex flex-col">
                                                    <span>{order.order_end_date || '-'}</span>
                                                    {order.order_status === 1 && order.estimated_completion_date && order.order_end_date && (
                                                        new Date(order.order_end_date.split(' ')[0]) <= new Date(order.estimated_completion_date) ? (
                                                            <span className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">🟢 Tepat</span>
                                                        ) : (
                                                            <span className="text-[10px] text-rose-600 font-bold uppercase mt-0.5">🔴 Telat</span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-gray-800">
                                                {order.customer ? order.customer.customer_name : (
                                                    <div className="flex flex-col">
                                                        <span>{order.non_member_name}</span>
                                                        <span className="text-xs text-amber-600 font-bold uppercase">Non-Member</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right font-bold text-rose-600">{formatCurrency(order.final_total ?? order.total)}</td>
                                            <td className="px-5 py-3 text-center">
                                                <button
                                                    onClick={() => handlePrintReceipt(order.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors text-xs font-semibold"
                                                    title="Print Struk"
                                                >
                                                    <Printer size={13} />
                                                    Struk
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!orders.data || orders.data.length === 0) && (
                                        <tr>
                                            <td colSpan="7" className="px-5 py-10 text-center text-gray-400 font-medium">Tidak ada data transaksi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {orders.links && orders.links.length > 3 && (
                            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-center gap-1">
                                {orders.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                            link.active
                                                ? 'bg-sky-600 text-white'
                                                : link.url
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
            
        </AuthenticatedLayout>
    );
}
