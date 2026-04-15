import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Form({ service }) {
    const isEdit = !!service;
    const { data, setData, post, put, processing, errors } = useForm({
        service_name: service?.service_name || '',
        price: service?.price || '',
        description: service?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.services.update', service.id));
        } else {
            post(route('admin.services.store'));
        }
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'Edit Layanan' : 'Tambah Layanan'}>
            <Head title={isEdit ? 'Edit Layanan' : 'Tambah Layanan'} />
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Nama Layanan</label>
                        <input
                            type="text"
                            value={data.service_name}
                            onChange={(e) => setData('service_name', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                            placeholder="Contoh: Cuci Komplit"
                        />
                        {errors.service_name && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.service_name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Harga (Rp)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-semibold">Rp</span>
                            </div>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="block w-full pl-12 rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                                placeholder="5000"
                            />
                        </div>
                        {errors.price && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Deskripsi Layanan</label>
                        <textarea
                            rows="4"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3 resize-none"
                            placeholder="Contoh: Harga per kilogram sudah termasuk parfum"
                        />
                        {errors.description && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.description}</p>}
                    </div>

                    <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-gray-100">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-indigo-600 font-medium text-white tracking-wide rounded-xl shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all">
                            {isEdit ? 'Update Layanan' : 'Simpan Layanan'}
                        </button>
                        <Link href={route('admin.services.index')} className="px-6 py-2.5 bg-white border border-gray-200 shadow-sm text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
