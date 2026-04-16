import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Users, 
    ShoppingBag, 
    Banknote, 
    PlusCircle, 
    Clock, 
    CheckCircle2, 
    TrendingUp, 
    ClipboardList,
    Calendar,
    ChevronRight
} from 'lucide-react';

export default function Dashboard({ stats, extraData }) {
    const { user } = usePage().props.auth;
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    // Role IDs (based on LevelSeeder)
    const isAdmin = user.id_level === 1;
    const isOperator = user.id_level === 2;
    const isPimpinan = user.id_level === 3;

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-2 space-y-6">
                {/* Welcome Banner - Refined Blue Theme */}
                <div className="bg-slate-900 overflow-hidden shadow-lg rounded-2xl relative">
                    {/* Decorative Patterns */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-500/10 to-transparent"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl"></div>
                    
                    <div className="px-6 py-8 md:px-10 md:py-10 text-white relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                System Operational
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Halo, {user.name.split(' ')[0]}!</h2>
                            <p className="text-slate-300 text-sm md:text-base font-medium max-w-md">
                                Selamat bertugas sebagai <span className="text-white font-semibold">{user.level?.level_name || 'Staff'}</span> hari ini.
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/20">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesi Aktif</p>
                                <p className="text-base font-bold text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Views */}
                <div className="animate-in fade-in duration-500">
                    {isAdmin && <AdminView stats={stats} formatCurrency={formatCurrency} />}
                    {isOperator && <OperatorView stats={stats} extraData={extraData} formatCurrency={formatCurrency} />}
                    {isPimpinan && <PimpinanView stats={stats} formatCurrency={formatCurrency} />}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// Sub-component: StatCard Refined
function StatCard({ label, value, icon: Icon, type = 'primary' }) {
    const isEmerald = type === 'success';
    
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md hover:border-sky-200 group">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex justify-center items-center transition-colors ${isEmerald ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                </div>
            </div>
        </div>
    );
}

// Admin View
function AdminView({ stats, formatCurrency }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                label="Total Pelanggan" 
                value={stats.total_customers} 
                icon={Users}
            />
            <StatCard 
                label="Order Hari Ini" 
                value={stats.total_orders_today} 
                icon={ShoppingBag}
            />
            <StatCard 
                label="Pendapatan Harian" 
                value={formatCurrency(stats.revenue_today)} 
                type="success"
                icon={Banknote}
            />
        </div>
    );
}

// Operator View
function OperatorView({ stats, extraData, formatCurrency }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Transaksi Masuk" 
                    value={stats.orders_today} 
                    icon={PlusCircle}
                />
                <StatCard 
                    label="Belum Diambil" 
                    value={stats.pending_pickups} 
                    icon={Clock}
                />
                <StatCard 
                    label="Pickup Hari Ini" 
                    value={stats.pickups_today} 
                    type="success"
                    icon={CheckCircle2}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                            <TrendingUp size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Transaksi Terbaru</h3>
                    </div>
                    <button className="flex items-center gap-1.5 text-sky-600 font-bold text-xs uppercase tracking-widest hover:text-sky-700 transition-colors">
                        Lihat Semua <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Pelanggan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Nilai</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {extraData.recent_transactions?.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-sky-600 text-xs px-2.5 py-1 bg-sky-50 rounded-md border border-sky-100">
                                            {order.order_code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 text-sm">{order.customer?.customer_name}</div>
                                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{order.order_date}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${order.order_status === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {order.order_status === 1 ? 'Selesai' : 'Diproses'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 tracking-tight">{formatCurrency(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Pimpinan View
function PimpinanView({ stats, formatCurrency }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Revenue Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex justify-center items-center border border-sky-100">
                        <TrendingUp className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">Pendapatan Bulan Ini</p>
                        <p className="text-4xl font-bold text-slate-900 tracking-tight leading-none">{formatCurrency(stats.monthly_revenue)}</p>
                    </div>
                </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex justify-center items-center border border-indigo-100">
                        <ClipboardList className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">Total Order Bulan Ini</p>
                        <p className="text-4xl font-bold text-slate-900 tracking-tight leading-none">{stats.monthly_orders} <span className="text-xl text-slate-400 font-medium">Orders</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

