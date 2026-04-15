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

            <div className="py-4 space-y-6">
                {/* Welcome Banner - Bright Sky Theme */}
                <div className="bg-sky-600 overflow-hidden shadow-xl rounded-[2rem] relative">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                    
                    <div className="p-8 md:p-10 text-white relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/20 border border-white/20 rounded-full text-white text-[9px] font-black uppercase tracking-widest">
                                <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                                System Online
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Halo, {user.name.split(' ')[0]}!</h2>
                            <p className="text-sky-100 text-base font-medium max-w-xl opacity-90">
                                Selamat bertugas sebagai <span className="font-bold border-b border-white/30">{user.level?.level_name || 'Staff'}</span> hari ini.
                            </p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-inner flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black opacity-60 uppercase tracking-[0.2em]">Sesi Aktif</p>
                                <p className="text-lg font-black text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Specific Dashboards */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
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
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex justify-center items-center shadow-lg transition-transform group-hover:scale-110 ${isEmerald ? 'bg-emerald-500 text-white' : 'bg-sky-600 text-white'}`}>
                    <Icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{value}</p>
                </div>
            </div>
        </div>
    );
}

// Admin View
function AdminView({ stats, formatCurrency }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-50 rounded-xl">
                            <TrendingUp size={18} className="text-sky-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Transaksi Terbaru</h3>
                    </div>
                    <button className="flex items-center gap-1.5 text-sky-600 font-black text-xs uppercase tracking-widest hover:gap-2 transition-all">
                        Lihat Semua <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-sky-50/50 text-sky-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Kode Invoice</th>
                                <th className="px-8 py-5">Pelanggan</th>
                                <th className="px-8 py-5">Status Order</th>
                                <th className="px-8 py-5 text-right">Nilai Transaksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {extraData.recent_transactions?.map((order) => (
                                <tr key={order.id} className="hover:bg-sky-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-mono font-black text-sky-700 text-sm py-1.5 px-3 bg-sky-50 rounded-lg">
                                            {order.order_code}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-800">{order.customer?.customer_name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{order.order_date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.order_status === 1 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                            {order.order_status === 1 ? 'Selesai' : 'Diproses'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-slate-900 text-lg tracking-tight">{formatCurrency(order.total)}</td>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Monthly Revenue Card */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-700 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl transition-transform duration-700"></div>
                <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex justify-center items-center backdrop-blur-md">
                        <TrendingUp className="w-9 h-9" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sky-100 text-xs font-black uppercase tracking-[0.2em] mb-2">Pendapatan Bulan Ini</p>
                        <p className="text-5xl font-black text-white tracking-tighter leading-none">{formatCurrency(stats.monthly_revenue)}</p>
                    </div>
                </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl transition-transform duration-700"></div>
                <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex justify-center items-center backdrop-blur-md">
                        <ClipboardList className="w-9 h-9" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-indigo-100 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Order Bulan Ini</p>
                        <p className="text-5xl font-black text-white tracking-tighter leading-none">{stats.monthly_orders} <span className="text-2xl text-indigo-200">Order</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
