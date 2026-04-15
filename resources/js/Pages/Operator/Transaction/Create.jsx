import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ customers, services }) {
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        id_customer: '',
        new_customer_name: '',
        new_customer_phone: '',
        new_customer_address: '',
        items: [{ id_service: '', qty: 1, notes: '' }]
    });

    const handleAddItem = () => {
        setData('items', [...data.items, { id_service: '', qty: 1, notes: '' }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const calculateTotal = () => {
        let total = 0;
        data.items.forEach(item => {
            const service = services.find(s => s.id == item.id_service);
            if(service && item.qty) {
                total += service.price * item.qty;
            }
        });
        return total;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Proses Transaksi?',
                text: "Pastikan data pelanggan dan layanan sudah benar.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0ea5e9',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Proses Sekarang',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    post(route('operator.transaction.store'));
                }
            });
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    return (
        <AuthenticatedLayout header="Transaksi Laundry Baru">
            <Head title="Transaksi Laundry" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} id="transaction-form" className="space-y-6">
                        {/* Customer Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800">1. Data Pelanggan</h3>
                                <button type="button" onClick={() => setIsNewCustomer(!isNewCustomer)} className="text-sm text-sky-600 font-semibold hover:text-sky-800">
                                    {isNewCustomer ? 'Pilih Pelanggan Lama' : '+ Pelanggan Baru'}
                                </button>
                            </div>
                            
                            {!isNewCustomer ? (
                                <div>
                                    <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Pilih Pelanggan</label>
                                    <select
                                        value={data.id_customer}
                                        onChange={(e) => setData('id_customer', e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-gray-50 focus:bg-white text-gray-800 px-4 py-3"
                                    >
                                        <option value="">-- Cari atau Pilih Pelanggan --</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.customer_name} - {c.phone}</option>
                                        ))}
                                    </select>
                                    {errors.id_customer && <p className="mt-1 text-sm text-red-500 font-medium">{errors.id_customer}</p>}
                                </div>
                            ) : (
                                <div className="space-y-4 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Nama Pelanggan Baru</label>
                                        <input
                                            type="text"
                                            value={data.new_customer_name}
                                            onChange={(e) => setData('new_customer_name', e.target.value)}
                                            className="block w-full rounded-xl border-sky-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-4 py-2"
                                        />
                                        {errors.new_customer_name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.new_customer_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Nomor HP</label>
                                        <input
                                            type="text"
                                            value={data.new_customer_phone}
                                            onChange={(e) => setData('new_customer_phone', e.target.value)}
                                            className="block w-full rounded-xl border-sky-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-4 py-2"
                                        />
                                        {errors.new_customer_phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.new_customer_phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Alamat</label>
                                        <textarea
                                            rows="2"
                                            value={data.new_customer_address}
                                            onChange={(e) => setData('new_customer_address', e.target.value)}
                                            className="block w-full rounded-xl border-sky-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-4 py-2"
                                        />
                                        {errors.new_customer_address && <p className="mt-1 text-xs text-red-500 font-medium">{errors.new_customer_address}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800">2. Detail Layanan</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {data.items.map((item, index) => {
                                    const selectedService = services.find(s => s.id == item.id_service);
                                    const subtotal = selectedService ? selectedService.price * item.qty : 0;
                                    
                                    return (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                                            {data.items.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveItem(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm transition-colors">
                                                    ✕
                                                </button>
                                            )}
                                            <div className="flex-1 w-full relative">
                                                <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1">Pilih Layanan</label>
                                                <select
                                                    value={item.id_service}
                                                    onChange={(e) => handleItemChange(index, 'id_service', e.target.value)}
                                                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm py-2 px-3"
                                                >
                                                    <option value="">-- Layanan --</option>
                                                    {services.map(s => <option key={s.id} value={s.id}>{s.service_name}</option>)}
                                                </select>
                                                <div className="mt-1">
                                                     {errors[`items.${index}.id_service`] && <p className="text-[10px] text-red-500">{errors[`items.${index}.id_service`]}</p>}
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-24">
                                                <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1">Berat (Kg)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm py-2 px-3"
                                                />
                                            </div>
                                            <div className="flex-1 w-full">
                                                <label className="block text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1">Catatan Khusus</label>
                                                <input
                                                    type="text"
                                                    value={item.notes}
                                                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm py-2 px-3"
                                                    placeholder="Contoh: Jangan terlalu wangi"
                                                />
                                            </div>
                                            <div className="w-full sm:w-32 bg-sky-50 px-4 py-2 rounded-lg border border-sky-100 flex items-center justify-end h-[38px]">
                                                <span className="font-bold text-sky-700">{formatCurrency(subtotal)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <button type="button" onClick={handleAddItem} className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors w-full border border-dashed border-gray-300">
                                + Tambah Layanan Lainnya
                            </button>
                            {errors.items && <p className="mt-2 text-sm text-red-500 font-medium text-center">{errors.items}</p>}
                        </div>
                    </form>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-sky-900 to-sky-800 rounded-2xl shadow-lg sticky top-6 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Ringkasan Transaksi</h3>
                            <div className="space-y-4 border-b border-sky-700/50 pb-6 mb-6">
                                {data.items.map((item, index) => {
                                    const service = services.find(s => s.id == item.id_service);
                                    if (!service) return null;
                                    return (
                                        <div key={index} className="flex justify-between text-sky-100 text-sm">
                                            <div className="flex-1">
                                                <p className="font-medium">{service.service_name}</p>
                                                <p className="text-sky-300 text-xs">{item.qty} kg × {formatCurrency(service.price)}</p>
                                            </div>
                                            <span className="font-bold text-white relative top-2">
                                                {formatCurrency(service.price * item.qty)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <div className="flex flex-col mb-8">
                                <span className="text-sky-200 text-sm mb-1 uppercase tracking-wider font-semibold">Total Tagihan</span>
                                <span className="text-4xl font-black text-white">{formatCurrency(calculateTotal())}</span>
                            </div>

                            <button 
                                type="submit" 
                                form="transaction-form" 
                                disabled={processing || data.items.length === 0} 
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 text-lg uppercase tracking-wide"
                            >
                                Proses Transaksi
                            </button>
                        </div>
                        {/* decorative element */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-sky-500 opacity-20 blur-2xl"></div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
