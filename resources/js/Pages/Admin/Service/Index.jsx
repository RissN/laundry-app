import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ services }) {
    const { delete: destroy } = useForm();
    const handleDelete = (id) => {
        import('sweetalert2').then((Swal) => {
            Swal.default.fire({
                title: 'Hapus Layanan?',
                text: "Data layanan ini akan dihapus secara permanen!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0284c7',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    destroy(route('admin.services.destroy', id), {
                        onSuccess: () => {
                            Swal.default.fire(
                                'Terhapus!',
                                'Layanan telah berhasil dihapus.',
                                'success'
                            )
                        }
                    });
                }
            });
        });
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    return (
        <AuthenticatedLayout header="Data Jenis Layanan">
            <Head title="Data Service" />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-base font-bold text-gray-800">Daftar Jenis Layanan Laundry</h2>
                    <Link href={route('admin.services.create')} className="px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors">
                        + Tambah Layanan
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wide text-xs font-semibold">
                            <tr>
                                <th className="px-5 py-3">Nama Layanan</th>
                                <th className="px-5 py-3">Harga (Rp)</th>
                                <th className="px-5 py-3">Deskripsi</th>
                                <th className="px-5 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.data.map(service => (
                                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 font-semibold text-gray-800">{service.service_name}</td>
                                    <td className="px-5 py-3 font-mono font-medium text-emerald-600">{formatCurrency(service.price)}</td>
                                    <td className="px-5 py-3 text-gray-500">{service.description || '-'}</td>
                                    <td className="px-5 py-3 text-right space-x-2">
                                        <Link href={route('admin.services.edit', service.id)} className="text-sky-600 hover:text-white hover:bg-sky-600 transition-colors bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-md font-medium text-xs uppercase inline-block">Edit</Link>
                                        <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-white hover:bg-red-600 transition-colors bg-red-50 border border-red-100 px-3 py-1.5 rounded-md font-medium text-xs uppercase inline-block">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {services.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-10 text-center text-gray-400 font-medium">Belum ada data layanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
