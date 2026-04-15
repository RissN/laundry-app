import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getRoleName = (levelId) => {
        if (levelId === 1) return 'Administrator';
        if (levelId === 2) return 'Operator';
        if (levelId === 3) return 'Pimpinan';
        return 'Unknown';
    };

    const navLinks = [
        { name: 'Dashboard', route: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', allowed: [1, 2, 3] },
        { name: 'Data Customer', route: 'admin.customers.index', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', allowed: [1] },
        { name: 'Data User', route: 'admin.users.index', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', allowed: [1] },
        { name: 'Data Service', route: 'admin.services.index', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', allowed: [1] },
        { name: 'Terima Laundry', route: 'operator.transaction.create', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', allowed: [1, 2] },
        { name: 'Pengambilan & Bayar', route: 'operator.pickup.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', allowed: [1, 2] },
        { name: 'Laporan Penjualan', route: 'pimpinan.report.index', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', allowed: [3] },
    ];

    const currentLinks = navLinks.filter(link => link.allowed.includes(user.id_level));

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-indigo-900 text-white w-64 shadow-xl z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex-shrink-0`}>
                <div className="flex items-center justify-center h-20 border-b border-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl">
                            <span className="text-indigo-900 font-bold text-xl px-1">🧺</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-sans tracking-wide">LaundriQ</h1>
                            <p className="text-xs text-indigo-300 tracking-wider uppercase">System</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-indigo-800/50 rounded-xl p-4 mb-6 border border-indigo-700/50 backdrop-blur-sm">
                        <p className="text-xs text-indigo-300 uppercase font-semibold mb-1">User Info</p>
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <div className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                            {getRoleName(user.id_level)}
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {currentLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={route(link.route)}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                    route().current(link.route)
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                        : 'text-indigo-100 hover:bg-indigo-800/60 hover:text-white'
                                }`}
                            >
                                <svg className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${route().current(link.route) ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                                </svg>
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                
                <div className="absolute bottom-0 w-full p-6">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center px-4 py-2.5 text-sm font-medium text-red-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 hover:text-red-100 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-100 z-10">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center justify-end w-full lg:w-auto">
                            {header && (
                                <div className="text-xl font-bold text-gray-800 tracking-tight">{header}</div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
                    {usePage().props.flash?.success && (
                        <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-md shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-emerald-800">{usePage().props.flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {usePage().props.flash?.error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{usePage().props.flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {children}
                </main>
            </div>
        </div>
    );
}
