import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                title: 'Berhasil!',
                text: flash.success,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
            });
        }
        if (flash.error) {
            Swal.fire({
                title: 'Gagal!',
                text: flash.error,
                icon: 'error',
                timer: 4000,
                showConfirmButton: true,
                confirmButtonColor: '#0ea5e9',
            });
        }
    }, [flash]);

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

    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Keluar Sistem?',
            text: "Anda akan keluar dari sesi ini.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Ya, Logout',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('logout'));
            }
        });
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-sky-900/50 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-sky-900 text-white w-64 shadow-xl z-30 transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}>
                <div className="flex items-center justify-center h-20 border-b border-sky-800/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-sm">
                            <span className="text-sky-900 font-bold text-xl px-1">🧺</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-sans tracking-wide">LaundriQ</h1>
                            <p className="text-[10px] text-sky-300 tracking-widest uppercase font-bold">Workspace</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 flex-1 overflow-y-auto relative scrollbar-hide">
                    <div className="bg-sky-800/40 rounded-xl p-4 mb-6 border border-sky-700/50">
                        <p className="text-[10px] text-sky-300 uppercase font-bold tracking-wider mb-1">Akun Anda</p>
                        <p className="font-semibold text-white truncate text-sm">{user.name}</p>
                        <div className="inline-flex mt-2 items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 uppercase">
                            {getRoleName(user.id_level)}
                        </div>
                    </div>

                    <nav className="space-y-1.5 focus:outline-none">
                        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2 mt-4">Menu Navigasi</p>
                        {currentLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={route(link.route)}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                    route().current(link.route)
                                        ? 'bg-sky-600 text-white shadow shadow-sky-900/20 ring-1 ring-white/10'
                                        : 'text-sky-200 hover:bg-sky-800/60 hover:text-white'
                                }`}
                            >
                                <svg className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${route().current(link.route) ? 'text-white' : 'text-sky-400 group-hover:text-sky-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                                </svg>
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                
                <div className="p-4 border-t border-sky-800/50 flex-shrink-0 bg-sky-900/50">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center px-4 py-2.5 text-sm font-bold tracking-wide text-red-200 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all border border-red-500/20 hover:border-red-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        LOGOUT SISTEM
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80 z-10 flex-shrink-0">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-500 hover:text-sky-600 focus:outline-none p-2 rounded-md hover:bg-sky-50 transition-colors"
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
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
