import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ orders, totalRevenue, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('pimpinan.report.index'));
    }

    const resetFilter = () => {
        router.get(route('pimpinan.report.index'));
    }

    return (
        <AuthenticatedLayout header="Laporan Penjualan Laundry">
            <Head title="Laporan Penjualan" />
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="bg-sky-600 rounded-xl p-5">
                    <p className="text-sky-100 font-medium uppercase text-xs mb-1">Total Pendapatan</p>
                    <h3 className="text-white text-3xl font-bold">{formatCurrency(totalRevenue)}</h3>
                    {filters.start_date || filters.end_date ? (
                        <p className="text-sky-200 text-sm mt-2 font-medium">Berdasarkan filter tanggal yang dipilih</p>
                    ) : (
                        <p className="text-sky-200 text-sm mt-2 font-medium">Dari semua transaksi yang selesai</p>
                    )}
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col justify-center">
                    <h4 className="text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide">Filter Laporan</h4>
                    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">Dari Tanggal</label>
                            <input 
                                type="date" 
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">Sampai Tanggal</label>
                            <input 
                                type="date" 
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button type="submit" disabled={processing} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                Filter
                            </button>
                            {(filters.start_date || filters.end_date) && (
                                <button type="button" onClick={resetFilter} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-lg border border-gray-200 transition-colors text-sm">
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.map(order => (
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
                                    <td className="px-5 py-3 font-mono text-gray-500">{order.order_end_date || '-'}</td>
                                    <td className="px-5 py-3 font-medium text-gray-800">
                                        {order.customer ? order.customer.customer_name : (
                                            <div className="flex flex-col">
                                                <span>{order.non_member_name}</span>
                                                <span className="text-xs text-amber-600 font-bold uppercase">Non-Member</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-right font-bold text-rose-600">{formatCurrency(order.final_total ?? order.total)}</td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-5 py-10 text-center text-gray-400 font-medium">Tidak ada data transaksi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
