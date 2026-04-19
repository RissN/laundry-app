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
        code: '',
        expires_at: '',
        duration: '',
        usage_limit: ''
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
        patch(route('admin.voucher.update', id));
    };

    const handleDelete = (id) => {
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Hapus Voucher?',
                text: "Voucher yang dihapus tidak dapat dipulihkan.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0284c7',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    destroy(route('admin.voucher.destroy', id), {
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
        postVoucher(route('admin.voucher.store'), {
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Create Voucher */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                    <Plus size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-gray-800">Buat Voucher</h3>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Akses Admin Only</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-5">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Kode Voucher</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            placeholder="Contoh: PROMO50"
                                            className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-bold"
                                        />
                                        <button 
                                            type="button"
                                            onClick={generateRandomCode}
                                            className="w-10 h-10 bg-sky-50 text-sky-600 rounded-lg border border-sky-100 flex items-center justify-center hover:bg-sky-100 transition-colors"
                                            title="Generate Kode Acak"
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                    </div>
                                    {errors.code && <p className="text-xs text-rose-500 font-medium">{errors.code}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Masa Berlaku</label>
                                    <select
                                        value={data.duration || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            let expiry = '';
                                            if (val === 'week') {
                                                const d = new Date();
                                                d.setDate(d.getDate() + 7);
                                                expiry = d.toISOString().split('T')[0];
                                            } else if (val === 'month') {
                                                const d = new Date();
                                                d.setMonth(d.getMonth() + 1);
                                                expiry = d.toISOString().split('T')[0];
                                            }
                                            setData((prev) => ({
                                                ...prev,
                                                duration: val,
                                                expires_at: expiry
                                            }));
                                        }}
                                        className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-medium"
                                    >
                                        <option value="">Selamanya</option>
                                        <option value="week">1 Minggu (7 Hari)</option>
                                        <option value="month">1 Bulan (30 Hari)</option>
                                    </select>
                                    {errors.expires_at && <p className="text-xs text-rose-500 font-medium">{errors.expires_at}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Batas Pemakaian (Opsional)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.usage_limit}
                                        onChange={(e) => setData('usage_limit', e.target.value)}
                                        placeholder="Kosongkan untuk tanpa batas"
                                        className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-800 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors font-medium"
                                    />
                                    {errors.usage_limit && <p className="text-xs text-rose-500 font-medium">{errors.usage_limit}</p>}
                                </div>

                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <Calendar size={14} />
                                        <span className="text-xs font-bold uppercase tracking-wide">Aturan Bisnis</span>
                                    </div>
                                    <ul className="text-xs text-amber-800 font-medium space-y-1">
                                        <li>• Diskon 10% untuk Non-Member</li>
                                        <li>• Diskon 15% untuk Member Terdaftar</li>
                                        <li>• Sekali pakai & langsung hangus</li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.code}
                                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                                >
                                    <Ticket size={18} />
                                    Simpan Voucher
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Voucher List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Riwayat & Daftar Voucher</h3>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total: {vouchers.total} Voucher</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Kode</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Berlaku Sampai</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Pemakaian</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {vouchers.data.map((voucher) => (
                                        <tr key={voucher.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg text-sm font-bold text-gray-700">{voucher.code}</span>
                                                    <button 
                                                        onClick={() => copyToClipboard(voucher.code)}
                                                        className="p-1 text-gray-300 hover:text-sky-500 transition-colors"
                                                        title="Salin Kode"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-600">
                                                        {voucher.expires_at ? new Date(voucher.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Selamanya'}
                                                    </span>
                                                    {voucher.expires_at && new Date(voucher.expires_at) < new Date().setHours(0,0,0,0) && (
                                                        <span className="text-xs text-rose-500 font-semibold">Sudah Kadaluarsa</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                {voucher.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                                        <CheckCircle2 size={12} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                                        <XCircle size={12} /> Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-0.5 text-sm font-semibold text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <History size={14} className="text-gray-300" />
                                                        {voucher.usages_count}x Digunakan
                                                    </div>
                                                    {voucher.usage_limit && (
                                                        <div className="text-xs text-gray-400">
                                                            Limit: {voucher.usage_limit} pemakaian
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleToggleStatus(voucher.id)}
                                                        className={`p-2 rounded-lg transition-colors border ${voucher.is_active ? 'bg-amber-50 border-amber-100 text-amber-500 hover:bg-amber-100' : 'bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-100'}`}
                                                        title={voucher.is_active ? "Nonaktifkan" : "Aktifkan Kembali"}
                                                    >
                                                        <Power size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(voucher.id)}
                                                        className="p-2 bg-rose-50 border border-rose-100 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                                                        title="Hapus Permanen"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {vouchers.data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-5 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-14 h-14 rounded-xl bg-gray-50 text-gray-200 flex items-center justify-center">
                                                        <Ticket size={28} />
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Belum ada data voucher</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {vouchers.links.length > 3 && (
                            <div className="px-5 py-4 border-t border-gray-100 flex justify-center gap-2">
                                {vouchers.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${link.active ? 'bg-sky-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-400 hover:text-sky-600'}`}
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
