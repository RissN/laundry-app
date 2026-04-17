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

        // Discount Logic
        // Registered if id_customer is selected or new customer registration
        const isRegistered = (data.id_customer !== '' || isNewCustomer) && !data.is_non_member;
        const hasVoucher = voucherData !== null;
        
        let discountPercent = 0;
        if (isRegistered && hasVoucher) {
            discountPercent = 15;
        } else if (hasVoucher) {
            discountPercent = 10;
        } else if (isRegistered) {
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
                confirmButtonColor: '#0ea5e9', // sky-500
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Proses',
                cancelButtonText: 'Batal',
                background: '#ffffff',
                borderRadius: '24px',
                customClass: {
                    title: 'font-black tracking-tight text-slate-800',
                    htmlContainer: 'font-medium text-slate-600'
                }
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-20 animate-in fade-in duration-700 transition-all">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/20">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
                                        <Search size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">1. Informasi Pelanggan</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Toggle Mode Pelanggan */}
                                <div className="flex flex-wrap gap-2 pb-4">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsNewCustomer(false);
                                            setData('is_non_member', false);
                                        }}
                                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 ${!isNewCustomer && !data.is_non_member ? 'bg-sky-600 text-white shadow-lg shadow-sky-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        <Search size={14} /> Member Terdaftar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsNewCustomer(true);
                                            setData('is_non_member', false);
                                        }}
                                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 ${isNewCustomer && !data.is_non_member ? 'bg-sky-600 text-white shadow-lg shadow-sky-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
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
                                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 ${data.is_non_member ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        <XCircle size={14} /> Tanpa Daftar (Bukan Member)
                                    </button>
                                </div>

                                {!data.is_non_member ? (
                                    !isNewCustomer ? (
                                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Pencarian Nama / No HP</label>
                                            <div className="relative group">
                                                <select
                                                    value={data.id_customer}
                                                    onChange={(e) => setData('id_customer', e.target.value)}
                                                    className="block w-full rounded-2xl border-gray-200 bg-white py-3.5 px-6 pr-12 text-gray-800 focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all font-bold shadow-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="">-- Cari Pelanggan Laundry --</option>
                                                    {customers.map(c => (
                                                        <option key={c.id} value={c.id}>{c.customer_name} • {c.phone}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500 group-hover:scale-110 transition-transform">
                                                    <Search size={18} />
                                                </div>
                                            </div>
                                            {errors.id_customer && <p className="mt-2 text-xs text-rose-500 font-bold ml-1 flex items-center gap-1"><Info size={12} /> {errors.id_customer}</p>}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-sky-50/50 rounded-[2rem] border border-sky-100 animate-in zoom-in-95 duration-300">
                                            <div className="md:col-span-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-600 ml-1">Nama Pelanggan</label>
                                                <input
                                                    type="text"
                                                    value={data.new_customer_name}
                                                    onChange={(e) => setData('new_customer_name', e.target.value)}
                                                    placeholder="Nama lengkap..."
                                                    className="block w-full rounded-2xl border-transparent bg-white py-3 px-5 text-gray-800 focus:ring-4 focus:ring-sky-200/50 focus:border-sky-400 transition-all font-bold shadow-sm"
                                                />
                                                {errors.new_customer_name && <p className="text-xs text-rose-500 font-bold ml-1">{errors.new_customer_name}</p>}
                                            </div>
                                            <div className="md:col-span-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-600 ml-1">Nomor WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={data.new_customer_phone}
                                                    onChange={(e) => setData('new_customer_phone', e.target.value)}
                                                    placeholder="08..."
                                                    className="block w-full rounded-2xl border-transparent bg-white py-3 px-5 text-gray-800 focus:ring-4 focus:ring-sky-200/50 focus:border-sky-400 transition-all font-bold shadow-sm"
                                                />
                                                {errors.new_customer_phone && <p className="text-xs text-rose-500 font-bold ml-1">{errors.new_customer_phone}</p>}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-600 ml-1">Alamat Lengkap</label>
                                                <textarea
                                                    rows="2"
                                                    value={data.new_customer_address}
                                                    onChange={(e) => setData('new_customer_address', e.target.value)}
                                                    placeholder="Detail alamat domisili..."
                                                    className="block w-full rounded-2xl border-transparent bg-white py-3 px-5 text-gray-800 focus:ring-4 focus:ring-sky-200/50 focus:border-sky-400 transition-all font-bold shadow-sm"
                                                />
                                                {errors.new_customer_address && <p className="text-xs text-rose-500 font-bold ml-1">{errors.new_customer_address}</p>}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100 animate-in zoom-in-95 duration-300">
                                        <div className="md:col-span-2 flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                                <Info size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">Sekali Pakai (Tanpa Member)</h4>
                                                <p className="text-[10px] text-amber-600 font-bold italic">Data ini hanya akan disimpan di nota transaksi ini saja.</p>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-amber-700 ml-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.non_member_name}
                                                onChange={(e) => setData('non_member_name', e.target.value)}
                                                placeholder="Nama pelanggan..."
                                                className="block w-full rounded-2xl border-transparent bg-white py-3 px-5 text-gray-800 focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all font-bold shadow-sm"
                                            />
                                            {errors.non_member_name && <p className="text-xs text-rose-500 font-bold ml-1">{errors.non_member_name}</p>}
                                        </div>
                                        <div className="md:col-span-1 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-amber-700 ml-1">Nomor HP</label>
                                            <input
                                                type="text"
                                                value={data.non_member_phone}
                                                onChange={(e) => setData('non_member_phone', e.target.value)}
                                                placeholder="Nomor kontak..."
                                                className="block w-full rounded-2xl border-transparent bg-white py-3 px-5 text-gray-800 focus:ring-4 focus:ring-amber-200/50 focus:border-amber-400 transition-all font-bold shadow-sm"
                                            />
                                            {errors.non_member_phone && <p className="text-xs text-rose-500 font-bold ml-1">{errors.non_member_phone}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items section */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
                                    <Scale size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">2. Detail Layanan Laundry</h3>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-700 rounded-2xl border border-sky-200">
                                <ShoppingCart size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{data.items.length} Layanan</span>
                            </div>
                        </div>
                        
                        <div className="px-8 py-6 space-y-6">
                            {data.items.map((item, index) => {
                                const selectedService = services.find(s => s.id == item.id_service);
                                const subtotal = selectedService ? selectedService.price * item.qty : 0;
                                
                                return (
                                    <div key={index} className="relative animate-in zoom-in-95 duration-300">
                                        <div className="bg-gray-50/40 rounded-[2rem] p-6 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:border-sky-100 group">
                                            {data.items.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveItem(index)} 
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-gray-100 shadow-sm transition-all hover:scale-110 active:scale-95 z-10"
                                                    title="Batalkan Item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                            
                                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
                                                {/* Service Select */}
                                                <div className="xl:col-span-5 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Jenis Layanan</label>
                                                    <div className="relative">
                                                        <select
                                                            value={item.id_service}
                                                            onChange={(e) => handleItemChange(index, 'id_service', e.target.value)}
                                                            className="w-full rounded-2xl border-gray-100 py-3 px-5 text-sm font-bold focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all bg-white shadow-sm appearance-none cursor-pointer"
                                                        >
                                                            <option value="">-- Pilih Layanan --</option>
                                                            {services.map(s => <option key={s.id} value={s.id}>{s.service_name}</option>)}
                                                        </select>
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-400">
                                                            <PlusCircle size={14} />
                                                        </div>
                                                    </div>
                                                    {errors[`items.${index}.id_service`] && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors[`items.${index}.id_service`]}</p>}
                                                </div>

                                                {/* Qty */}
                                                <div className="xl:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center block">Berat (Kg)</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        step="0.1"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                        className="w-full rounded-2xl border-gray-100 py-3 px-4 text-base font-black text-center focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all bg-white shadow-sm"
                                                    />
                                                </div>

                                                {/* Notes */}
                                                <div className="xl:col-span-3 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Catatan Staf</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={item.notes}
                                                            onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                                            placeholder="Instruksi khusus..."
                                                            className="w-full rounded-2xl border-gray-100 py-3 pl-11 pr-4 text-sm font-medium focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all bg-white shadow-sm"
                                                        />
                                                        <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>

                                                {/* Subtotal Display */}
                                                <div className="xl:col-span-2 space-y-3 text-right pr-12">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pr-1">Subtotal</label>
                                                    <div className="h-[48px] flex items-center justify-end">
                                                        <span className="text-xl font-black text-sky-600 tracking-tighter">{formatCurrency(subtotal)}</span>
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
                                className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-sky-100 text-sky-400 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50/50 rounded-[2rem] transition-all font-black text-xs uppercase tracking-widest group bg-sky-50/20 active:scale-[0.99]"
                            >
                                <PlusCircle size={16} className="transition-transform group-hover:rotate-90" />
                                Tambah Sub-Item Laundry
                            </button>
                        </div>
                    </div>

                    {/* Voucher Section */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mt-8">
                        <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                                <Ticket size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">3. Voucher & Promosi</h3>
                        </div>
                        <div className="px-8 py-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        value={data.voucher_code}
                                        onChange={(e) => setData('voucher_code', e.target.value.toUpperCase())}
                                        placeholder="Ketik kode voucher..."
                                        disabled={!!voucherData}
                                        className={`block w-full rounded-2xl border-gray-100 py-3.5 px-6 pr-12 text-gray-800 focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all font-bold shadow-sm ${!!voucherData ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white'}`}
                                    />
                                    {voucherData && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500">
                                            <CheckCircle size={18} />
                                        </div>
                                    )}
                                </div>
                                {!voucherData ? (
                                    <button
                                        type="button"
                                        onClick={handleValidateVoucher}
                                        disabled={isValidatingVoucher || !data.voucher_code}
                                        className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        {isValidatingVoucher ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Ticket size={16} />
                                        )}
                                        {isValidatingVoucher ? 'Memvalidasi...' : 'Terapkan Voucher'}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleRemoveVoucher}
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-500 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={16} />
                                        Hapus
                                    </button>
                                )}
                            </div>
                            {voucherError && <p className="mt-4 text-xs text-rose-500 font-bold ml-1 flex items-center gap-1"><Info size={12} /> {voucherError}</p>}
                            {voucherData && <p className="mt-4 text-xs text-emerald-600 font-black ml-1 flex items-center gap-1 uppercase tracking-widest"><Check size={14} /> Voucher '{voucherData.code}' berhasil diterapkan!</p>}
                        </div>
                    </div>
                </div>

                {/* Receipt Sidebar - Clean Sky Theme */}
                <div className="lg:col-span-1 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    <div className="bg-sky-50 rounded-[2.5rem] shadow-xl overflow-hidden relative border border-sky-100">
                        {/* Soft Glow decorative */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-40 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-sky-200 opacity-30 blur-3xl"></div>
                        
                        <div className="px-8 py-6 relative z-10">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100">
                                <div className="flex items-center gap-2">
                                    <LucideReceipt className="text-sky-600" size={18} />
                                    <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">Order Summary</h3>
                                </div>
                                <div className="text-[10px] text-sky-400 font-mono font-bold">#{Math.floor(Math.random() * 900000 + 100000)}</div>
                            </div>
                            
                            <div className="space-y-6 mb-12 min-h-[100px]">
                                {data.items.some(i => i.id_service) ? (
                                    data.items.map((item, index) => {
                                        const service = services.find(s => s.id == item.id_service);
                                        if (!service) return null;
                                        return (
                                            <div key={index} className="flex justify-between items-start animate-in slide-in-from-top-1 bg-white/50 p-4 rounded-2xl border border-white shadow-sm">
                                                <div className="space-y-1">
                                                    <p className="text-slate-800 text-xs font-black tracking-tight">{service.service_name}</p>
                                                    <p className="text-[9px] text-sky-500 font-black uppercase tracking-widest">{item.qty}Kg × {formatCurrency(service.price)}</p>
                                                </div>
                                                <span className="text-sm font-black text-sky-600">{formatCurrency(service.price * item.qty)}</span>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-sky-100 rounded-[2rem] bg-white/30 transition-all group hover:bg-white/50">
                                        <ShoppingCart size={40} className="text-sky-200 mb-3 group-hover:scale-110 transition-transform" />
                                        <p className="text-sky-300 text-[10px] font-black uppercase text-center tracking-widest">Keranjang Kosong</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Calculation Details */}
                            <div className="space-y-4 mb-10 pt-8 border-t border-dashed border-sky-200">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-3 mb-8">
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Subtotal</span>
                                            <span className="font-bold">{formatCurrency(totals.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Pajak ({TAX_RATE * 100}%)</span>
                                            <span className="font-bold">{formatCurrency(totals.tax)}</span>
                                        </div>
                                        
                                        {totals.discountPercent > 0 && (
                                            <div className="flex justify-between items-center text-emerald-600">
                                                <span className="text-[10px] font-black uppercase tracking-wider">Diskon Member/Voucher ({totals.discountPercent}%)</span>
                                                <span className="font-bold">-{formatCurrency(totals.discountAmount)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mt-4 mb-2">
                                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Total Bill Amount</span>
                                            <div className="h-px bg-sky-100 flex-1 mx-4"></div>
                                        </div>
                                        <div className="text-5xl font-black text-slate-900 tracking-tighter leading-none flex items-baseline">
                                            <span className="text-2xl mr-1 text-sky-500">Rp</span>
                                            {totals.total.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing || totals.total === 0 || (!data.id_customer && !isNewCustomer)}
                                        className="group w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-2xl font-black text-sm shadow-lg shadow-sky-200 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3 uppercase tracking-widest overflow-hidden relative"
                                    >
                                        {processing ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={20} className="transition-transform group-hover:scale-110" />
                                        )}
                                        <span className="relative z-10">{processing ? 'Proses...' : 'Finalisasi & Bayar'}</span>
                                    </button>
                                </form>
                                
                                <div className="text-center pt-6">
                                    <p className="text-[9px] text-sky-300 font-black uppercase tracking-[0.3em]">Official Receipt LaundriQ</p>
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
