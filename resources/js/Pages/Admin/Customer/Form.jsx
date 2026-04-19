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
            <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.customer_name}
                            onChange={(e) => setData('customer_name', e.target.value)}
                            className="block w-full rounded-lg border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2.5"
                            placeholder="Contoh: Budi Santoso"
                        />
                        {errors.customer_name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.customer_name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Nomor Handphone</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="block w-full rounded-lg border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2.5"
                            placeholder="Contoh: 081234567890"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-500 font-medium">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Alamat Lengkap</label>
                        <textarea
                            rows="4"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="block w-full rounded-lg border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2.5 resize-none"
                            placeholder="Contoh: Jl. Merdeka No.1"
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-500 font-medium">{errors.address}</p>}
                    </div>

                    <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-gray-100">
                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-sky-600 font-semibold text-white rounded-lg hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-colors">
                            {isEdit ? 'Update Data' : 'Simpan Data'}
                        </button>
                        <Link href={route('admin.customers.index')} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
