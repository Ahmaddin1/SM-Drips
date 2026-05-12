import Link from 'next/link';
import { getDashboardStats, getRevenueByDay, getOrdersByPaymentMethod, getRecentOrders } from '@/lib/adminStats';
import RevenueChart from '@/components/admin/RevenueChart';
import PaymentMethodChart from '@/components/admin/PaymentMethodChart';

export default async function AdminDashboard() {
  const [stats, revenueData, paymentData, recentOrders] = await Promise.all([
    getDashboardStats().catch(() => ({
      totalOrdersToday: 0,
      totalOrdersThisWeek: 0,
      totalOrdersThisMonth: 0,
      revenueToday: 0,
      revenueThisWeek: 0,
      revenueThisMonth: 0,
      pendingOrders: 0,
      lowStockProducts: 0
    })),
    getRevenueByDay(7).catch(() => []),
    getOrdersByPaymentMethod().catch(() => []),
    getRecentOrders(10).catch(() => [])
  ]);

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending_confirmation: 'bg-yellow-900/50 text-yellow-400',
      confirmed: 'bg-blue-900/50 text-blue-400',
      shipped: 'bg-purple-900/50 text-purple-400',
      delivered: 'bg-green-900/50 text-green-400',
      cancelled: 'bg-red-900/50 text-red-400'
    };
    return statusMap[status] || 'bg-gray-900/50 text-gray-400';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-[#000000] p-8 space-y-8">
      {/* Row 1 - Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
          <div className="text-4xl font-bebas text-[#defc3e]">{stats.totalOrdersToday}</div>
          <div className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mt-2">Today's Orders</div>
        </div>
        
        <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
          <div className="text-4xl font-bebas text-[#defc3e]">{formatCurrency(stats.revenueThisMonth)}</div>
          <div className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mt-2">Monthly Revenue</div>
        </div>
        
        <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
          <div className="text-4xl font-bebas text-[#defc3e]">{stats.pendingOrders}</div>
          <div className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mt-2">Pending Orders</div>
        </div>
        
        <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
          <div className="text-4xl font-bebas text-[#defc3e]">{stats.lowStockProducts}</div>
          <div className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mt-2">Low Stock Items</div>
        </div>
      </div>

      {/* Row 2 - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
          <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Revenue — Last 7 Days</h3>
          <RevenueChart data={revenueData} />
        </div>
        
        <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
          <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Orders by Payment Method</h3>
          <PaymentMethodChart data={paymentData} />
        </div>
      </div>

      {/* Row 3 - Recent Orders Table */}
      <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
        <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Recent Orders</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1a1a]">
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Order ID</th>
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Customer</th>
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Amount</th>
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Payment</th>
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Status</th>
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Date</th>
                <th className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-[#6b6b6b] py-8">No orders yet.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-[#1a1a1a]">
                    <td className="px-4 py-4 text-[#defc3e] font-mono text-sm">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white">{order.customer.name}</div>
                      <div className="text-xs text-[#6b6b6b]">{order.customer.email}</div>
                    </td>
                    <td className="px-4 py-4 text-white">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-4 text-white capitalize">{order.paymentMethod.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(order.orderStatus)}`}>
                        {formatStatus(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4">
                      <Link 
                        href={`/admin/orders/${order._id}`}
                        className="text-[#defc3e] hover:underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
