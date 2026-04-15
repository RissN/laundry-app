import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Form({ user, levels }) {
    const isEdit = !!user;
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        id_level: user?.id_level || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.users.update', user.id));
        } else {
            post(route('admin.users.store'));
        }
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'Edit User' : 'Tambah User'}>
            <Head title={isEdit ? 'Edit User' : 'Tambah User'} />
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Nama Pengguna</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                            placeholder="Contoh: Admin Budi"
                        />
                        {errors.name && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Alamat Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                            placeholder="Contoh: admin@laundry.com"
                        />
                        {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Password {isEdit && <span className="text-gray-400 font-normal lowercase">(Kosongkan jika tidak ingin mengubah)</span>}</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                        />
                        {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-2">Level Akses (Role)</label>
                        <select
                            value={data.id_level}
                            onChange={(e) => setData('id_level', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-gray-50 focus:bg-white text-gray-800 transition-colors px-4 py-3"
                        >
                            <option value="" disabled>-- Pilih Level --</option>
                            {levels.map(level => (
                                <option key={level.id} value={level.id}>{level.level_name}</option>
                            ))}
                        </select>
                        {errors.id_level && <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{errors.id_level}</p>}
                    </div>

                    <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-gray-100">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-sky-600 font-medium text-white tracking-wide rounded-xl shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-all">
                            {isEdit ? 'Update Akun' : 'Simpan Akun'}
                        </button>
                        <Link href={route('admin.users.index')} className="px-6 py-2.5 bg-white border border-gray-200 shadow-sm text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
