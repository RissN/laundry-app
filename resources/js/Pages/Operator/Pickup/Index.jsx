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
                confirmButtonColor: '#0284c7',
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
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-800">Daftar Cucian Siap Ambil</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Hanya menampilkan order yang belum dibayar / diambil</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wide text-xs font-semibold">
                            <tr>
                                <th className="px-5 py-3">Kode Transaksi</th>
                                <th className="px-5 py-3">Pelanggan</th>
                                <th className="px-5 py-3">Tgl Masuk</th>
                                <th className="px-5 py-3">Layanan / Detail</th>
                                <th className="px-5 py-3 text-right">Total Tagihan</th>
                                <th className="px-5 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded text-xs">
                                            {order.order_code}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-semibold text-gray-800">
                                        {order.customer ? order.customer.customer_name : (
                                            <div className="flex flex-col">
                                                <span>{order.non_member_name}</span>
                                                <span className="text-xs text-amber-600 font-bold uppercase">Non-Member</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-gray-600">{order.order_date}</td>
                                    <td className="px-5 py-3 text-gray-500 text-xs">
                                        <ul className="list-disc list-inside">
                                            {order.details.map(detail => (
                                                <li key={detail.id}>{detail.service?.service_name} ({detail.qty} kg)</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-5 py-3 text-right font-bold">
                                        <span className="text-rose-600 text-base">
                                            {formatCurrency(order.final_total ?? order.total)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button 
                                            onClick={() => openModal(order)} 
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
                                        >
                                            Ambil & Bayar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-5 py-14 text-center">
                                        <div className="mx-auto w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium">Semua order sudah diselesaikan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-5 sm:p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Pembayaran</h3>
                                <p className="text-sm text-gray-500 font-mono mt-0.5">{selectedOrder.order_code}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1.5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="bg-rose-50 rounded-lg p-4 mb-5 border border-rose-100 space-y-2">
                            <div className="flex justify-between items-center text-rose-800 text-xs font-semibold uppercase tracking-wide">
                                <span>Subtotal & Pajak</span>
                                <span>{formatCurrency(selectedOrder.total)}</span>
                            </div>
                            {selectedOrder.discount_amount > 0 && (
                                <div className="flex justify-between items-center text-emerald-600 text-xs font-semibold uppercase tracking-wide pb-2">
                                    <span>Diskon ({selectedOrder.discount_percent}%)</span>
                                    <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                                </div>
                            )}
                            <div className="pt-2 border-t border-rose-200 flex justify-between items-baseline">
                                <span className="text-rose-900 text-sm font-bold uppercase tracking-wide">Grand Total</span>
                                <span className="text-3xl font-bold text-rose-600">{formatCurrency(selectedOrder.final_total ?? selectedOrder.total)}</span>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Uang Diterima (Rp)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-semibold">Rp</span>
                                    </div>
                                    <input
                                        type="number"
                                        min={payableAmount}
                                        value={data.order_pay}
                                        onChange={(e) => setData('order_pay', e.target.value)}
                                        className="block w-full pl-10 rounded-lg border-gray-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 text-lg font-bold py-2.5 px-4"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                                {errors.order_pay && <p className="mt-1 text-sm text-red-500 font-medium">{errors.order_pay}</p>}
                            </div>

                            <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 flex justify-between items-center">
                                <span className="text-sky-800 text-sm font-semibold uppercase tracking-wide">Kembalian</span>
                                <span className={`text-xl font-bold ${change >= 0 ? 'text-sky-600' : 'text-red-500'}`}>
                                    {formatCurrency(change)}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Catatan Tambahan (Opsional)</label>
                                <textarea
                                    rows="2"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-3 py-2 resize-none text-sm"
                                    placeholder="Contoh: Diambil oleh kerabatnya"
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-500 font-medium">{errors.notes}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing || data.order_pay < payableAmount} 
                                className="w-full py-3 mt-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base uppercase tracking-wide"
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
