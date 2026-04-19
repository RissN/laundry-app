import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { 
    WashingMachine, 
    LayoutDashboard, 
    Users, 
    UserCircle, 
    Package, 
    PlusCircle, 
    HandCoins, 
    FileBarChart2, 
    LogOut, 
    Menu,
    Ticket
} from 'lucide-react';

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
                confirmButtonColor: '#0284c7',
            });
        }
    }, [flash]);

    const getRoleName = (levelId) => {
        if (levelId === 1) return 'Administrator';
        if (levelId === 2) return 'Operator';
        if (levelId === 3) return 'Pimpinan';
        return 'Unknown';
    };

    const navGroups = [
        {
            group: 'Utama',
            links: [
                { name: 'Dashboard', route: 'dashboard', icon: LayoutDashboard, allowed: [1, 2, 3] },
            ]
        },
        {
            group: 'Master Data',
            links: [
                { name: 'Data Customer', route: 'admin.customers.index', icon: Users, allowed: [1] },
                { name: 'Data User', route: 'admin.users.index', icon: UserCircle, allowed: [1] },
                { name: 'Data Service', route: 'admin.services.index', icon: Package, allowed: [1] },
            ]
        },
        {
            group: 'Transaksi',
            links: [
                { name: 'Terima Laundry', route: 'operator.transaction.create', icon: PlusCircle, allowed: [1, 2] },
                { name: 'Pengambilan & Bayar', route: 'operator.pickup.index', icon: HandCoins, allowed: [1, 2] },
                { name: 'Manajemen Voucher', route: 'admin.voucher.index', icon: Ticket, allowed: [1] },
            ]
        },
        {
            group: 'Laporan',
            links: [
                { name: 'Laporan Penjualan', route: 'pimpinan.report.index', icon: FileBarChart2, allowed: [3] },
            ]
        }
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Keluar Sistem?',
            text: "Anda akan keluar dari sesi ini.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0284c7',
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
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-[260px] bg-slate-800 z-30 transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}>
                {/* Brand Header */}
                <div className="flex items-center justify-center h-16 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-600 p-2 rounded-lg">
                            <WashingMachine className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">LaundriQ</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Workspace</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="px-4 pt-4 pb-4 flex-1 overflow-y-auto">
                    {/* User Card */}
                    <div className="rounded-xl p-3 mb-5 border border-slate-700 bg-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white truncate text-sm">{user.name}</p>
                                <span className="text-xs text-emerald-400 font-medium">
                                    {user.level?.level_name || 'Administrator'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <div className="space-y-4">
                        {navGroups.map((group) => {
                            const filteredLinks = group.links.filter(link => link.allowed.includes(user.id_level));
                            if (filteredLinks.length === 0) return null;

                            return (
                                <div key={group.group}>
                                    <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{group.group}</p>
                                    <nav className="space-y-1">
                                        {filteredLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={route(link.route)}
                                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                                    route().current(link.route)
                                                        ? 'bg-sky-600 text-white'
                                                        : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                                }`}
                                            >
                                                <link.icon className={`mr-3 h-[18px] w-[18px] flex-shrink-0 ${route().current(link.route) ? 'text-white' : 'text-slate-500'}`} />
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Logout Button */}
                <div className="p-4 border-t border-slate-700 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white"
                    >
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                <header className="bg-white shadow-sm border-b border-gray-200 z-10 flex-shrink-0">
                    <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-500 hover:text-sky-600 focus:outline-none p-2 rounded-md hover:bg-sky-50 transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex items-center justify-end w-full lg:w-auto">
                            {header && (
                                <div className="text-lg font-bold text-gray-800">{header}</div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
                    <div className="max-w-full h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
