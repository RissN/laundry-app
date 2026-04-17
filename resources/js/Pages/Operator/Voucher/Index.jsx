import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Ticket, 
    Trash2, 
    Plus, 
    Calendar, 
    History, 
    Power,
    CheckCircle2,
    XCircle,
    Copy,
    RefreshCw
} from 'lucide-react';

export default function Index({ vouchers }) {
    const { delete: destroy, post, patch } = useForm();
    const [isCreating, setIsCreating] = useState(false);
    const { data, setData, post: postVoucher, processing, reset, errors } = useForm({
        code: ''
    });

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'LAU-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData('code', code);
    };

    const handleToggleStatus = (id) => {
        patch(route('operator.voucher.update', id));
    };

    const handleDelete = (id) => {
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Hapus Voucher?',
                text: "Voucher yang dihapus tidak dapat dipulihkan.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0ea5e9',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    destroy(route('operator.voucher.destroy', id), {
                        onSuccess: () => {
                            Swal.default.fire('Berhasil!', 'Voucher telah dihapus.', 'success');
                        }
                    });
                }
            });
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postVoucher(route('operator.voucher.store'), {
            onSuccess: () => {
                setIsCreating(false);
                reset();
            }
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Disalin!',
                text: 'Kode voucher disalin ke clipboard.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        });
    };

    return (
        <AuthenticatedLayout header="Manajemen Voucher">
            <Head title="Manajemen Voucher" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Create Voucher */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Buat Voucher</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Baru & Promosi</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Kode Voucher</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 group">
                                            <input
                                                type="text"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                                placeholder="Contoh: PROMO50"
                                                className="block w-full rounded-2xl border-gray-100 bg-white py-3.5 px-6 text-gray-800 focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all font-bold shadow-sm"
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={generateRandomCode}
                                            className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100 flex items-center justify-center hover:bg-sky-100 transition-all active:scale-95 shadow-sm"
                                            title="Generate Kode Acak"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                    </div>
                                    {errors.code && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.code}</p>}
                                </div>

                                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Aturan Bisnis</span>
                                    </div>
                                    <ul className="text-[11px] text-amber-800 font-bold space-y-2">
                                        <li className="flex items-start gap-2">• Diskon 10% untuk Non-Member</li>
                                        <li className="flex items-start gap-2">• Diskon 15% untuk Member Terdaftar</li>
                                        <li className="flex items-start gap-2">• Sekali pakai & langsung hangus</li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.code}
                                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-3"
                                >
                                    <Ticket size={20} />
                                    Simpan Voucher
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Voucher List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                                    <History size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Riwayat & Daftar Voucher</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total: {vouchers.total} Voucher</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kode</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Pemakaian</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {vouchers.data.map((voucher) => (
                                        <tr key={voucher.id} className="hover:bg-sky-50/30 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-sm font-black text-slate-700 shadow-sm">{voucher.code}</span>
                                                    <button 
                                                        onClick={() => copyToClipboard(voucher.code)}
                                                        className="p-1.5 text-slate-300 hover:text-sky-500 transition-colors"
                                                        title="Salin Kode"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {voucher.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 size={10} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                                        <XCircle size={10} /> Hangus
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 font-bold text-slate-600 italic">
                                                    <History size={14} className="text-slate-300" />
                                                    {voucher.usages_count}x Digunakan
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleToggleStatus(voucher.id)}
                                                        className={`p-2.5 rounded-xl transition-all shadow-sm border ${voucher.is_active ? 'bg-amber-50 border-amber-100 text-amber-500 hover:bg-amber-100' : 'bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-100'}`}
                                                        title={voucher.is_active ? "Nonaktifkan" : "Aktifkan Kembali"}
                                                    >
                                                        <Power size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(voucher.id)}
                                                        className="p-2.5 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-100 transition-all shadow-sm"
                                                        title="Hapus Permanen"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {vouchers.data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 rounded-3xl bg-gray-50 text-gray-200 flex items-center justify-center">
                                                        <Ticket size={32} />
                                                    </div>
                                                    <p className="text-xs text-slate-300 font-black uppercase tracking-[0.2em]">Belum ada data voucher</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination placeholder if needed */}
                        {vouchers.links.length > 3 && (
                            <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/20 flex justify-center gap-2">
                                {vouchers.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${link.active ? 'bg-sky-600 text-white shadow-lg shadow-sky-100' : 'bg-white border border-gray-100 text-slate-400 hover:text-sky-600'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
