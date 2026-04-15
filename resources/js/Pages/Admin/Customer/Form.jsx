import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Form({ customer }) {
    const isEdit = !!customer;
    const { data, setData, post, put, processing, errors } = useForm({
        customer_name: customer?.customer_name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.customers.update', customer.id));
        } else {
            post(route('admin.customers.store'));
        }
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'Edit Customer' : 'Tambah Customer'}>
            <Head title={isEdit ? 'Edit Customer' : 'Tambah Customer'} />
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.customer_name}
                            onChange={(e) => setData('customer_name', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                            placeholder="Contoh: Budi Santoso"
                        />
                        {errors.customer_name && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.customer_name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Nomor Handphone</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                            placeholder="Contoh: 081234567890"
                        />
                        {errors.phone && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Alamat Lengkap</label>
                        <textarea
                            rows="4"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3 resize-none"
                            placeholder="Contoh: Jl. Merdeka No.1"
                        />
                        {errors.address && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.address}</p>}
                    </div>

                    <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-gray-100">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-indigo-600 font-medium text-white tracking-wide rounded-xl shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all">
                            {isEdit ? 'Update Data' : 'Simpan Data'}
                        </button>
                        <Link href={route('admin.customers.index')} className="px-6 py-2.5 bg-white border border-gray-200 shadow-sm text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
