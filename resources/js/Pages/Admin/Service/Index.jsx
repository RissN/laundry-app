import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ services }) {
    const { delete: destroy } = useForm();
    const handleDelete = (id) => {
        if(confirm('Are you sure you want to delete this service?')) {
            destroy(route('admin.services.destroy', id));
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    return (
        <AuthenticatedLayout header="Data Jenis Layanan">
            <Head title="Data Service" />
            <div className="bg-white rounded-2xl shadow-sm shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800">Daftar Jenis Layanan Laundry</h2>
                    <Link href={route('admin.services.create')} className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition shadow-sm">
                        + Tambah Layanan
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Nama Layanan</th>
                                <th className="px-6 py-4">Harga (Rp)</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.data.map(service => (
                                <tr key={service.id} className="hover:bg-sky-50/30 transition duration-150">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{service.service_name}</td>
                                    <td className="px-6 py-4 font-mono font-medium text-emerald-600 bg-emerald-50/30">{formatCurrency(service.price)}</td>
                                    <td className="px-6 py-4 text-gray-500">{service.description || '-'}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={route('admin.services.edit', service.id)} className="text-sky-600 hover:text-white hover:bg-sky-600 transition-colors bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-md font-medium text-xs uppercase tracking-wide inline-block">Edit</Link>
                                        <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-white hover:bg-red-600 transition-colors bg-red-50 border border-red-100 px-3 py-1.5 rounded-md font-medium text-xs uppercase tracking-wide inline-block">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {services.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">Belum ada data layanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
