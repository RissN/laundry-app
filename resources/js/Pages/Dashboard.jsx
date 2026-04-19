import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Users, 
    UserCircle,
    Package,
    ShoppingBag, 
    Clock, 
    TrendingUp, 
    ClipboardList,
    Calendar
} from 'lucide-react';

export default function Dashboard({ stats, extraData }) {
    const { user } = usePage().props.auth;
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    }

    const isAdmin = user.id_level === 1;
    const isOperator = user.id_level === 2;
    const isPimpinan = user.id_level === 3;

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-2 space-y-6">
                {/* Welcome Banner */}
                <div className="bg-sky-600 rounded-xl overflow-hidden">
                    <div className="px-6 py-6 md:px-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">Halo, {user.name.split(' ')[0]}!</h2>
                            <p className="text-sky-100 text-sm font-medium">
                                Selamat bertugas sebagai <span className="text-white font-semibold">{user.level?.level_name || 'Staff'}</span> hari ini.
                            </p>
                        </div>
                        <div className="bg-white/10 px-4 py-2.5 rounded-lg flex items-center gap-3">
                            <Calendar size={16} className="text-sky-200" />
                            <span className="text-sm font-semibold text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Views */}
                {isAdmin && <AdminView stats={stats} />}
                {isOperator && <OperatorView stats={stats} extraData={extraData} formatCurrency={formatCurrency} />}
                {isPimpinan && <PimpinanView stats={stats} extraData={extraData} formatCurrency={formatCurrency} />}
            </div>
        </AuthenticatedLayout>
    );
}

// StatCard
function StatCard({ label, value, icon: Icon, color = 'sky' }) {
    const colors = {
        sky: 'bg-sky-50 text-sky-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg flex justify-center items-center ${colors[color]}`}>
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

// Admin View: total customer, user, service
function AdminView({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard label="Total Customer" value={stats.total_customers} icon={Users} color="sky" />
            <StatCard label="Total User" value={stats.total_users} icon={UserCircle} color="purple" />
            <StatCard label="Total Service" value={stats.total_services} icon={Package} color="emerald" />
        </div>
    );
}

// Operator View: transaksi hari ini, pending pickup + tabel terbaru
function OperatorView({ stats, extraData, formatCurrency }) {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <StatCard label="Transaksi Hari Ini" value={stats.orders_today} icon={ShoppingBag} color="sky" />
                <StatCard label="Pending Pickup" value={stats.pending_pickups} icon={Clock} color="amber" />
            </div>

            {/* Tabel Transaksi Terbaru */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Transaksi Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
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
                                        <span className="font-mono font-bold text-sky-600 text-xs bg-sky-50 px-2 py-1 rounded">{order.order_code}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="font-semibold text-gray-900">{order.customer ? order.customer.customer_name : order.non_member_name}</div>
                                        {!order.customer && <div className="text-xs text-amber-500 font-bold uppercase">Non-Member</div>}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.order_status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {order.order_status === 1 ? 'Selesai' : 'Diproses'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right font-bold text-gray-900">{formatCurrency(order.final_total ?? order.total)}</td>
                                </tr>
                            ))}
                            {(!extraData.recent_transactions || extraData.recent_transactions.length === 0) && (
                                <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-400 font-medium">Belum ada transaksi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Pimpinan View: pendapatan & order bulan ini + TABEL LAPORAN PENJUALAN
function PimpinanView({ stats, extraData, formatCurrency }) {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <StatCard label="Pendapatan Bulan Ini" value={formatCurrency(stats.monthly_revenue)} icon={TrendingUp} color="emerald" />
                <StatCard label="Total Order Bulan Ini" value={stats.monthly_orders} icon={ClipboardList} color="sky" />
            </div>

            {/* Tabel Laporan Penjualan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Laporan Penjualan Terbaru</h3>
                    <p className="text-xs text-gray-500 mt-0.5">10 transaksi selesai terakhir</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                                <th className="px-5 py-3">Kode Transaksi</th>
                                <th className="px-5 py-3">Pelanggan</th>
                                <th className="px-5 py-3">Tgl Masuk</th>
                                <th className="px-5 py-3">Tgl Selesai</th>
                                <th className="px-5 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {extraData.recent_sales?.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="font-mono font-bold text-gray-700 text-xs">{order.order_code}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="font-semibold text-gray-900">{order.customer ? order.customer.customer_name : order.non_member_name}</div>
                                        {!order.customer && <div className="text-xs text-amber-500 font-bold uppercase">Non-Member</div>}
                                    </td>
                                    <td className="px-5 py-3 text-gray-600">{order.order_date}</td>
                                    <td className="px-5 py-3 text-gray-600">{order.order_end_date || '-'}</td>
                                    <td className="px-5 py-3 text-right font-bold text-emerald-600">{formatCurrency(order.final_total ?? order.total)}</td>
                                </tr>
                            ))}
                            {(!extraData.recent_sales || extraData.recent_sales.length === 0) && (
                                <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-400 font-medium">Belum ada transaksi selesai.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
