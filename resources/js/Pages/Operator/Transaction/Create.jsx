import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { 
    PlusCircle, 
    X, 
    Trash2, 
    ArrowLeft, 
    UserPlus, 
    Search, 
    Scale, 
    FileText, 
    CheckCircle,
    Info,
    Loader2,
    ShoppingCart,
    ChevronRight,
    LucideReceipt,
    Ticket,
    XCircle,
    Check
} from 'lucide-react';

export default function Create({ customers, services }) {
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        id_customer: '',
        new_customer_name: '',
        new_customer_phone: '',
        new_customer_address: '',
        items: [{ id_service: '', qty: 1, notes: '' }],
        voucher_code: '',
        is_non_member: false,
        non_member_name: '',
        non_member_phone: ''
    });

    const [voucherData, setVoucherData] = useState(null);
    const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
    const [voucherError, setVoucherError] = useState('');

    // Reset voucher when customer changes to force re-validation
    React.useEffect(() => {
        if (voucherData) {
            handleRemoveVoucher();
        }
    }, [data.id_customer, data.is_non_member]);

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

    const handleValidateVoucher = async () => {
        if (!data.voucher_code) return;
        
        setIsValidatingVoucher(true);
        setVoucherError('');
        try {
            const response = await axios.post(route('operator.voucher.validate'), { 
                code: data.voucher_code,
                id_customer: data.id_customer
            });
            if (response.data.success) {
                setVoucherData(response.data.voucher);
            }
        } catch (error) {
            setVoucherError(error.response?.data?.message || 'Voucher tidak valid');
            setVoucherData(null);
        } finally {
            setIsValidatingVoucher(false);
        }
    };

    const handleRemoveVoucher = () => {
        setData('voucher_code', '');
        setVoucherData(null);
        setVoucherError('');
    };

    const TAX_RATE = 0.10;

    const calculateTotals = () => {
        let subtotalItems = 0;
        data.items.forEach(item => {
            const service = services.find(s => s.id == item.id_service);
            if(service && item.qty) {
                subtotalItems += service.price * Number(item.qty);
            }
        });
        const tax = Math.round(subtotalItems * TAX_RATE);
        const subtotalWithTax = subtotalItems + tax;

        // Welcome Discount Logic (Only for first-time members)
        const selectedCustomer = customers.find(c => c.id == data.id_customer);
        const isEligibleForWelcome = (isNewCustomer || (selectedCustomer && selectedCustomer.orders_count === 0)) && !data.is_non_member;
        const hasVoucher = voucherData !== null;
        
        let discountPercent = 0;
        if (isEligibleForWelcome && hasVoucher) {
            discountPercent = 15;
        } else if (hasVoucher) {
            discountPercent = 10;
        } else if (isEligibleForWelcome) {
            discountPercent = 5;
        }

        const discountAmount = Math.round(subtotalWithTax * (discountPercent / 100));
        const total = subtotalWithTax - discountAmount;

        return { 
            subtotal: subtotalItems, 
            tax, 
            subtotalWithTax,
            discountPercent, 
            discountAmount, 
            total 
        };
    };

    const totals = calculateTotals();

    const handleSubmit = (e) => {
        e.preventDefault();
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Konfirmasi Transaksi',
                text: "Pastikan data pelanggan dan layanan sudah benar.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0284c7',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Proses',
                cancelButtonText: 'Batal',
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
        <AuthenticatedLayout 
            header="Terima Laundry"
        >
            <Head title="Transaksi Laundry" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-20">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                    <Search size={18} />
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Informasi Pelanggan</h3>
                            </div>
                        </div>
                        
                        <div className="px-5 py-5">
                            <div className="grid grid-cols-1 gap-5">
                                {/* Toggle Mode Pelanggan */}
                                <div className="flex flex-wrap gap-2 pb-3">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsNewCustomer(false);
                                            setData('is_non_member', false);
                                        }}
                                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-2 ${!isNewCustomer && !data.is_non_member ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        <Search size={14} /> Member Terdaftar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsNewCustomer(true);
                                            setData('is_non_member', false);
                                        }}
                                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-2 ${isNewCustomer && !data.is_non_member ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        <UserPlus size={14} /> Daftar Member Baru
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsNewCustomer(false);
                                            setData('is_non_member', true);
                                            setData('id_customer', '');
                                        }}
                                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-2 ${data.is_non_member ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        <XCircle size={14} /> Tanpa Daftar (Bukan Member)
                                    </button>
                                </div>

                                {!data.is_non_member ? (
                                    !isNewCustomer ? (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pencarian Nama / No HP</label>
                                            <div className="relative">
                                                <select
                                                    value={data.id_customer}
                                                    onChange={(e) => setData('id_customer', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-200 bg-white py-3 px-4 pr-10 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-medium"
                                                >
                                                    <option value="">-- Cari Pelanggan Laundry --</option>
                                                    {customers.map(c => (
                                                        <option key={c.id} value={c.id}>{c.customer_name} • {c.phone}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.id_customer && <p className="text-xs text-rose-500 font-medium flex items-center gap-1"><Info size={12} /> {errors.id_customer}</p>}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold uppercase tracking-wide text-sky-700">Nama Pelanggan</label>
                                                <input
                                                    type="text"
                                                    value={data.new_customer_name}
                                                    onChange={(e) => setData('new_customer_name', e.target.value)}
                                                    placeholder="Nama lengkap..."
                                                    className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-medium"
                                                />
                                                {errors.new_customer_name && <p className="text-xs text-rose-500 font-medium">{errors.new_customer_name}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold uppercase tracking-wide text-sky-700">Nomor WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={data.new_customer_phone}
                                                    onChange={(e) => setData('new_customer_phone', e.target.value)}
                                                    placeholder="08..."
                                                    className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-medium"
                                                />
                                                {errors.new_customer_phone && <p className="text-xs text-rose-500 font-medium">{errors.new_customer_phone}</p>}
                                            </div>
                                            <div className="md:col-span-2 space-y-1.5">
                                                <label className="text-xs font-semibold uppercase tracking-wide text-sky-700">Alamat Lengkap</label>
                                                <textarea
                                                    rows="2"
                                                    value={data.new_customer_address}
                                                    onChange={(e) => setData('new_customer_address', e.target.value)}
                                                    placeholder="Detail alamat domisili..."
                                                    className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-medium"
                                                />
                                                {errors.new_customer_address && <p className="text-xs text-rose-500 font-medium">{errors.new_customer_address}</p>}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                        <div className="md:col-span-2 flex items-center gap-3 mb-1">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                                <Info size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Sekali Pakai (Tanpa Member)</h4>
                                                <p className="text-xs text-amber-600 italic">Data ini hanya akan disimpan di nota transaksi ini saja.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-amber-700">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.non_member_name}
                                                onChange={(e) => setData('non_member_name', e.target.value)}
                                                placeholder="Nama pelanggan..."
                                                className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-colors font-medium"
                                            />
                                            {errors.non_member_name && <p className="text-xs text-rose-500 font-medium">{errors.non_member_name}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-wide text-amber-700">Nomor HP</label>
                                            <input
                                                type="text"
                                                value={data.non_member_phone}
                                                onChange={(e) => setData('non_member_phone', e.target.value)}
                                                placeholder="Nomor kontak..."
                                                className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-colors font-medium"
                                            />
                                            {errors.non_member_phone && <p className="text-xs text-rose-500 font-medium">{errors.non_member_phone}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                    <Scale size={18} />
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Layanan Laundry</h3>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg">
                                <ShoppingCart size={14} />
                                <span className="text-xs font-semibold">{data.items.length} Layanan</span>
                            </div>
                        </div>
                        
                        <div className="px-5 py-5 space-y-4">
                            {data.items.map((item, index) => {
                                const selectedService = services.find(s => s.id == item.id_service);
                                const subtotal = selectedService ? selectedService.price * item.qty : 0;
                                
                                return (
                                    <div key={index} className="relative">
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            {data.items.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveItem(index)} 
                                                    className="absolute top-3 right-3 text-gray-400 hover:text-rose-500 bg-white p-1.5 rounded-lg border border-gray-200 transition-colors z-10"
                                                    title="Batalkan Item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            
                                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-end">
                                                {/* Service Select */}
                                                <div className="xl:col-span-5 space-y-1.5">
                                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Jenis Layanan</label>
                                                    <select
                                                        value={item.id_service}
                                                        onChange={(e) => handleItemChange(index, 'id_service', e.target.value)}
                                                        className="w-full rounded-lg border-gray-200 py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors bg-white"
                                                    >
                                                        <option value="">-- Pilih Layanan --</option>
                                                        {services.map(s => <option key={s.id} value={s.id}>{s.service_name}</option>)}
                                                    </select>
                                                    {errors[`items.${index}.id_service`] && <p className="text-xs text-rose-500 font-medium">{errors[`items.${index}.id_service`]}</p>}
                                                </div>

                                                {/* Qty */}
                                                <div className="xl:col-span-2 space-y-1.5">
                                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 text-center block">Berat (Kg)</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        step="0.1"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                        className="w-full rounded-lg border-gray-200 py-2.5 px-3 text-base font-bold text-center focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors bg-white"
                                                    />
                                                </div>

                                                {/* Notes */}
                                                <div className="xl:col-span-3 space-y-1.5">
                                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Catatan Staf</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={item.notes}
                                                            onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                                            placeholder="Instruksi khusus..."
                                                            className="w-full rounded-lg border-gray-200 py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors bg-white"
                                                        />
                                                        <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>

                                                {/* Subtotal Display */}
                                                <div className="xl:col-span-2 space-y-1.5 text-right pr-10">
                                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subtotal</label>
                                                    <div className="h-[40px] flex items-center justify-end">
                                                        <span className="text-lg font-bold text-sky-600">{formatCurrency(subtotal)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            <button 
                                type="button" 
                                onClick={handleAddItem} 
                                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors font-semibold text-xs uppercase tracking-wide"
                            >
                                <PlusCircle size={16} />
                                Tambah Sub-Item Laundry
                            </button>
                        </div>
                    </div>

                </div>

                {/* Receipt Sidebar */}
                <div className="lg:col-span-1 sticky top-8">
                    <div className="bg-sky-50 rounded-xl shadow-sm overflow-hidden border border-sky-100">
                        <div className="px-5 py-5">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-sky-100">
                                <div className="flex items-center gap-2">
                                    <LucideReceipt className="text-sky-600" size={18} />
                                    <h3 className="text-sm font-bold text-gray-800 uppercase">Order Summary</h3>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-8 min-h-[80px]">
                                {data.items.some(i => i.id_service) ? (
                                    data.items.map((item, index) => {
                                        const service = services.find(s => s.id == item.id_service);
                                        if (!service) return null;
                                        return (
                                            <div key={index} className="flex justify-between items-start bg-white p-3 rounded-lg border border-sky-100">
                                                <div className="space-y-0.5">
                                                    <p className="text-gray-800 text-xs font-bold">{service.service_name}</p>
                                                    <p className="text-xs text-sky-500 font-semibold">{item.qty}Kg × {formatCurrency(service.price)}</p>
                                                </div>
                                                <span className="text-sm font-bold text-sky-600">{formatCurrency(service.price * item.qty)}</span>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-sky-100 rounded-xl bg-white/50">
                                        <ShoppingCart size={32} className="text-sky-200 mb-2" />
                                        <p className="text-sky-300 text-xs font-semibold uppercase text-center">Keranjang Kosong</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Calculation Details */}
                            <div className="space-y-4 pt-3 border-t border-dashed border-sky-200">
                                {/* Voucher Input */}
                                <div className="space-y-2 mb-4">
                                    <p className="text-xs font-semibold uppercase text-sky-500 tracking-wide">Kupon / Voucher Promo</p>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={data.voucher_code}
                                                onChange={(e) => setData('voucher_code', e.target.value.toUpperCase())}
                                                placeholder="KODE..."
                                                disabled={!!voucherData}
                                                className={`block w-full rounded-lg border-gray-200 py-2 px-3 text-xs font-semibold transition-colors ${!!voucherData ? 'bg-emerald-50 text-emerald-700' : 'bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400'}`}
                                            />
                                            <Ticket className={`absolute right-3 top-1/2 -translate-y-1/2 ${voucherData ? 'text-emerald-500' : 'text-sky-200'}`} size={14} />
                                        </div>
                                        {!voucherData ? (
                                            <button
                                                type="button"
                                                onClick={handleValidateVoucher}
                                                disabled={isValidatingVoucher || !data.voucher_code}
                                                className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg font-semibold text-xs uppercase transition-colors"
                                            >
                                                {isValidatingVoucher ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleRemoveVoucher}
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-500 px-3 py-2 rounded-lg font-semibold text-xs uppercase border border-rose-100 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    {voucherError && <p className="text-xs text-rose-500 font-medium">{voucherError}</p>}
                                    {voucherData && (
                                        <p className="text-xs text-emerald-600 font-semibold uppercase flex items-center gap-1">
                                            <Check size={12} /> Voucher Applied
                                        </p>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-2 mb-6">
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span className="text-xs font-semibold uppercase">Subtotal</span>
                                            <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span className="text-xs font-semibold uppercase">Pajak ({TAX_RATE * 100}%)</span>
                                            <span className="font-semibold">{formatCurrency(totals.tax)}</span>
                                        </div>
                                        
                                        {totals.discountPercent > 0 && (
                                            <div className="flex justify-between items-center text-emerald-600">
                                                <span className="text-xs font-semibold uppercase">
                                                    {totals.discountPercent === 15 ? 'Welcome + Voucher' : (totals.discountPercent === 5 ? 'Welcome Discount' : 'Voucher Discount')} ({totals.discountPercent}%)
                                                </span>
                                                <span className="font-semibold">-{formatCurrency(totals.discountAmount)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mt-3 mb-1">
                                            <span className="text-gray-400 text-xs font-semibold uppercase">Total Bill Amount</span>
                                            <div className="h-px bg-sky-100 flex-1 mx-3"></div>
                                        </div>
                                        <div className="text-4xl font-bold text-gray-900 flex items-baseline">
                                            <span className="text-xl mr-1 text-sky-600">Rp</span>
                                            {totals.total.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing || totals.total === 0 || (!data.id_customer && !isNewCustomer && !data.is_non_member)}
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-30 flex items-center justify-center gap-2 uppercase tracking-wide"
                                    >
                                        {processing ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={18} />
                                        )}
                                        <span>{processing ? 'Proses...' : 'Finalisasi & Bayar'}</span>
                                    </button>
                                </form>
                                
                                <div className="text-center pt-4">
                                    <p className="text-xs text-sky-300 font-semibold uppercase tracking-wide">Official Receipt LaundriQ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                  -webkit-appearance: none; 
                  margin: 0; 
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
                select {
                    background-image: none !important;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
