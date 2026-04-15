import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const { user } = usePage().props.auth;
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 overflow-hidden shadow-xl sm:rounded-3xl relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
                    <div className="p-8 text-white relative z-10">
                        <h2 className="text-3xl font-black mb-2">Selamat Datang, {user.name}!</h2>
                        <p className="text-indigo-200">Anda login sebagai {user.level?.level_name || 'Administrator'}</p>
                    </div>
                </div>

                {user.id_level === 1 && stats && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
                            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex justify-center items-center mr-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Pelanggan</p>
                                <p className="text-3xl font-black text-gray-800 leading-tight">{stats.total_customers}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-500 flex justify-center items-center mr-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Order Masuk Hari Ini</p>
                                <p className="text-3xl font-black text-gray-800 leading-tight">{stats.total_orders_today}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
                            <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-500 flex justify-center items-center mr-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Pendapatan Hari Ini</p>
                                <p className="text-3xl font-black text-gray-800 leading-tight">{formatCurrency(stats.revenue_today)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
