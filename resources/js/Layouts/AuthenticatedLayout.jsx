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
                confirmButtonColor: '#0ea5e9',
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
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <WashingMachine className="text-slate-900 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold font-sans tracking-tight">LaundriQ</h1>
                            <p className="text-[10px] text-sky-400 tracking-widest uppercase font-bold">Workspace</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto relative scrollbar-hide">
                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                        <p className="text-[10px] text-sky-400 uppercase font-bold tracking-wider mb-1">Akun Anda</p>
                        <p className="font-semibold text-white truncate text-sm">{user.name}</p>
                        <div className="inline-flex mt-2 items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 uppercase">
                            {user.level?.level_name || 'Administrator'}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {navGroups.map((group) => {
                            const filteredLinks = group.links.filter(link => link.allowed.includes(user.id_level));
                            if (filteredLinks.length === 0) return null;

                            return (
                                <div key={group.group}>
                                    <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{group.group}</p>
                                    <nav className="space-y-0.5">
                                        {filteredLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={route(link.route)}
                                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                                    route().current(link.route)
                                                        ? 'bg-sky-500 text-white shadow-sm ring-1 ring-white/10 font-semibold'
                                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <link.icon className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${route().current(link.route) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="p-4 border-t border-white/5 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center px-4 py-2.5 text-[11px] font-bold tracking-wider text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all active:scale-[0.98] group"
                    >
                        <LogOut className="w-4 h-4 mr-2.5 transition-transform group-hover:-translate-x-1" />
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
                                <Menu className="h-6 w-6" />
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
                    <div className="max-w-full h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
