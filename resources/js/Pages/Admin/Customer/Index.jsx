import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ customers }) {
    const { delete: destroy } = useForm();
    const handleDelete = (id) => {
        if(confirm('Are you sure you want to delete this customer?')) {
            destroy(route('admin.customers.destroy', id));
        }
    }
    return (
        <AuthenticatedLayout header="Data Customer">
            <Head title="Data Customer" />
            <div className="bg-white rounded-2xl shadow-sm shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800">List Customers</h2>
                    <Link href={route('admin.customers.create')} className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition shadow-sm">
                        + Tambah Customer
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4">Nomor HP</th>
                                <th className="px-6 py-4">Alamat</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.data.map(customer => (
                                <tr key={customer.id} className="hover:bg-sky-50/30 transition duration-150">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{customer.customer_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{customer.address}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={route('admin.customers.edit', customer.id)} className="text-sky-600 hover:text-white hover:bg-sky-600 transition-colors bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-md font-medium text-xs uppercase tracking-wide inline-block">Edit</Link>
                                        <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-white hover:bg-red-600 transition-colors bg-red-50 border border-red-100 px-3 py-1.5 rounded-md font-medium text-xs uppercase tracking-wide inline-block">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {customers.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">Belum ada data customer.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
