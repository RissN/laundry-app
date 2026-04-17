import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ orders }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        order_pay: '',
        notes: ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    const openModal = (order) => {
        setSelectedOrder(order);
        setData({
            order_pay: '',
            notes: ''
        });
    }

    const closeModal = () => {
        setSelectedOrder(null);
        reset();
    }

    const handlePayment = (e) => {
        e.preventDefault();
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Selesaikan Pembayaran?',
                text: `Konfirmasi pembayaran untuk order ${selectedOrder.order_code}.`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0ea5e9',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Bayar & Ambil',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    post(route('operator.pickup.store', selectedOrder.id), {
                        onSuccess: () => {
                            closeModal();
                            Swal.default.fire('Selesai!', 'Transaksi telah berhasil diselesaikan.', 'success');
                        }
                    });
                }
            });
        });
    }

    const payableAmount = selectedOrder?.final_total ?? selectedOrder?.total ?? 0;
    const change = (data.order_pay && !isNaN(data.order_pay)) ? Number(data.order_pay) - payableAmount : 0;

    return (
        <AuthenticatedLayout header="Pengambilan & Pembayaran">
            <Head title="Pengambilan Laundry" />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800">Daftar Cucian Siap Ambil</h2>
                    <p className="text-sm text-gray-500 mt-1">Hanya menampilkan order yang belum dibayar / diambil</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Kode Transaksi</th>
                                <th className="px-6 py-4">Pelanggan</th>
                                <th className="px-6 py-4">Tgl Masuk</th>
                                <th className="px-6 py-4">Layanan / Detail</th>
                                <th className="px-6 py-4 text-right">Total Tagihan</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-sky-50/30 transition duration-150">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-sky-700 bg-sky-50 inline-block px-2 py-1 rounded inline-flex items-center">
                                            {order.order_code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{order.customer?.customer_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.order_date}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        <ul className="list-disc list-inside">
                                            {order.details.map(detail => (
                                                <li key={detail.id}>{detail.service?.service_name} ({detail.qty} kg)</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black">
                                        <div className="flex flex-col items-end text-rose-600 text-base">
                                            {formatCurrency(order.final_total ?? order.total)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => openModal(order)} 
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg shadow-sm w-full transition-colors whitespace-nowrap"
                                        >
                                            Ambil & Bayar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium text-lg">Semua order sudah diselesaikan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/70 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-2xl font-black text-gray-800">Pembayaran</h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">{selectedOrder.order_code}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="bg-rose-50 rounded-xl p-5 mb-6 border border-rose-100 space-y-3">
                            <div className="flex justify-between items-center text-rose-800 text-xs font-bold uppercase tracking-wider">
                                <span>Subtotal & Pajak</span>
                                <span>{formatCurrency(selectedOrder.total)}</span>
                            </div>
                            {selectedOrder.discount_amount > 0 && (
                                <div className="flex justify-between items-center text-emerald-600 text-xs font-bold uppercase tracking-wider pb-2">
                                    <span>Diskon ({selectedOrder.discount_percent}%)</span>
                                    <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-rose-200 flex justify-between items-baseline">
                                <span className="text-rose-900 text-sm font-black uppercase tracking-widest">Grand Total</span>
                                <span className="text-4xl font-black text-rose-600 tracking-tight">{formatCurrency(selectedOrder.final_total ?? selectedOrder.total)}</span>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Uang Diterima (Rp)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-bold">Rp</span>
                                    </div>
                                    <input
                                        type="number"
                                        min={payableAmount}
                                        value={data.order_pay}
                                        onChange={(e) => setData('order_pay', e.target.value)}
                                        className="block w-full pl-12 rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:border-2 focus:ring-0 bg-gray-50 focus:bg-white text-gray-800 text-lg font-bold px-4 py-3"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                                {errors.order_pay && <p className="mt-1.5 text-sm leading-tight text-red-500 font-medium">{errors.order_pay}</p>}
                            </div>

                            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex justify-between items-center transition-all bg-opacity-50">
                                <span className="text-sky-800 text-sm font-bold uppercase tracking-wider block">Kembalian</span>
                                <span className={`text-2xl font-black tracking-tight ${change >= 0 ? 'text-sky-600' : 'text-red-500'}`}>
                                    {formatCurrency(change)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Catatan Tambahan (Opsional)</label>
                                <textarea
                                    rows="2"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2 resize-none text-sm"
                                    placeholder="Contoh: Diambil oleh kerabatnya"
                                />
                                {errors.notes && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.notes}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing || data.order_pay < payableAmount} 
                                className="w-full py-4 mt-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wider"
                            >
                                Selesaikan Pesanan
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
