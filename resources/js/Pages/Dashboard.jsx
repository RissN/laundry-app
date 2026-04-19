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
                {/* Welcome Banner */}
                <div className="bg-sky-600 rounded-xl overflow-hidden">
                    <div className="px-6 py-8 md:px-8 md:py-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/15 rounded-md text-white text-xs font-semibold uppercase tracking-wide">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                System Operational
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Halo, {user.name.split(' ')[0]}!</h2>
                            <p className="text-sky-100 text-sm font-medium">
                                Selamat bertugas sebagai <span className="text-white font-semibold">{user.level?.level_name || 'Staff'}</span> hari ini.
                            </p>
                        </div>
                        
                        <div className="bg-white/10 px-4 py-3 rounded-lg flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white/15 text-white flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-sky-200 uppercase tracking-wide">Sesi Aktif</p>
                                <p className="text-sm font-bold text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Views */}
                <div>
                    {isAdmin && <AdminView stats={stats} formatCurrency={formatCurrency} />}
                    {isOperator && <OperatorView stats={stats} extraData={extraData} formatCurrency={formatCurrency} />}
                    {isPimpinan && <PimpinanView stats={stats} formatCurrency={formatCurrency} />}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// Sub-component: StatCard
function StatCard({ label, value, icon: Icon, type = 'primary' }) {
    const isEmerald = type === 'success';
    
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg flex justify-center items-center ${isEmerald ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

// Admin View
function AdminView({ stats, formatCurrency }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                            <TrendingUp size={18} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Transaksi Terbaru</h3>
                    </div>
                    <button className="flex items-center gap-1 text-sky-600 font-semibold text-xs uppercase tracking-wide hover:text-sky-700 transition-colors">
                        Lihat Semua <ChevronRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                                <th className="px-5 py-3">Invoice</th>
                                <th className="px-5 py-3">Pelanggan</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Nilai</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {extraData.recent_transactions?.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="font-mono font-bold text-sky-600 text-xs px-2 py-1 bg-sky-50 rounded">
                                            {order.order_code}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="font-semibold text-gray-900 text-sm">
                                            {order.customer ? order.customer.customer_name : order.non_member_name}
                                        </div>
                                        {!order.customer && <div className="text-xs text-amber-500 font-bold uppercase">Non-Member</div>}
                                        <div className="text-xs text-gray-400 mt-0.5">{order.order_date}</div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.order_status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {order.order_status === 1 ? 'Selesai' : 'Diproses'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right font-bold text-gray-900">{formatCurrency(order.final_total ?? order.total)}</td>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Monthly Revenue Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-4">
                    <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 flex justify-center items-center">
                        <TrendingUp className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Pendapatan Bulan Ini</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthly_revenue)}</p>
                    </div>
                </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-4">
                    <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex justify-center items-center">
                        <ClipboardList className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Total Order Bulan Ini</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.monthly_orders} <span className="text-lg text-gray-400 font-medium">Orders</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
