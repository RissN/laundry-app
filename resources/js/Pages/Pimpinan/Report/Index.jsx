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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-sky-600 to-sky-800 rounded-2xl p-6 shadow-sky-500/20 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sky-100 font-medium tracking-wide uppercase text-xs mb-1">Total Pendapatan</p>
                        <h3 className="text-white text-4xl font-black">{formatCurrency(totalRevenue)}</h3>
                        {filters.start_date || filters.end_date ? (
                            <p className="text-sky-200 text-sm mt-3 font-medium">Berdasarkan filter tanggal yang dipilih</p>
                        ) : (
                            <p className="text-sky-200 text-sm mt-3 font-medium">Dari semua transaksi yang selesai</p>
                        )}
                    </div>
                    {/* Decorative */}
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h4 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Filter Laporan</h4>
                    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 w-full relative">
                            <label className="block tracking-wide text-gray-500 text-xs font-bold mb-1 uppercase">Dari Tanggal</label>
                            <input 
                                type="date" 
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm transition-all"
                            />
                        </div>
                        <div className="flex-1 w-full relative">
                            <label className="block tracking-wide text-gray-500 text-xs font-bold mb-1 uppercase">Sampai Tanggal</label>
                            <input 
                                type="date" 
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button type="submit" disabled={processing} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer text-sm">
                                Filter
                            </button>
                            {(filters.start_date || filters.end_date) && (
                                <button type="button" onClick={resetFilter} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl border border-gray-200 transition-colors cursor-pointer text-sm">
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Kode Transaksi</th>
                                <th className="px-6 py-4">Tgl Masuk</th>
                                <th className="px-6 py-4">Tgl Selesai</th>
                                <th className="px-6 py-4">Pelanggan</th>
                                <th className="px-6 py-4 text-right">Total Transaksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-sky-50/30 transition duration-150">
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.order_status === 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                                            {order.order_status === 1 ? 'Selesai' : 'Diproses'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-gray-700">{order.order_code}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-500">{order.order_date}</td>
                                    <td className="px-6 py-4 font-mono text-gray-500">{order.order_end_date || '-'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{order.customer?.customer_name}</td>
                                    <td className="px-6 py-4 text-right font-black text-rose-600">{formatCurrency(order.total)}</td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium">Tidak ada data transaksi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
