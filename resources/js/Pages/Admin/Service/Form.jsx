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
            <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Nama Layanan</label>
                        <input
                            type="text"
                            value={data.service_name}
                            onChange={(e) => setData('service_name', e.target.value)}
                            className="block w-full rounded-lg border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2.5"
                            placeholder="Contoh: Cuci Komplit"
                        />
                        {errors.service_name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.service_name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Harga (Rp)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-semibold">Rp</span>
                            </div>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="block w-full pl-10 rounded-lg border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2.5"
                                placeholder="5000"
                            />
                        </div>
                        {errors.price && <p className="mt-1 text-sm text-red-500 font-medium">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wide text-gray-700 uppercase mb-1.5">Deskripsi Layanan</label>
                        <textarea
                            rows="4"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="block w-full rounded-lg border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-2.5 resize-none"
                            placeholder="Contoh: Harga per kilogram sudah termasuk parfum"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500 font-medium">{errors.description}</p>}
                    </div>

                    <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-gray-100">
                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-sky-600 font-semibold text-white rounded-lg hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-colors">
                            {isEdit ? 'Update Layanan' : 'Simpan Layanan'}
                        </button>
                        <Link href={route('admin.services.index')} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
