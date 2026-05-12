import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';
import CancelOrderButton from '@/components/admin/CancelOrderButton';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;

  await connectDB();
  const order = await Order.findById(orderId).lean();

  if (!order) {
    notFound();
  }

  const formatCurrency = (amount) => `Rs. ${amount.toLocaleString('en-PK')}`;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-900/50 text-green-400',
      pending: 'bg-yellow-900/50 text-yellow-400',
      failed: 'bg-red-900/50 text-red-400',
      refunded: 'bg-blue-900/50 text-blue-400'
    };
    return styles[status] || 'bg-gray-900/50 text-gray-400';
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      cod: 'Cash on Delivery',
      bank_deposit: 'Bank Transfer',
      jazzcash: 'JazzCash'
    };
    return methods[method] || method;
  };

  const whatsappLink = buildWhatsAppLink({
    phone: order.customer.whatsappNumber,
    orderId: order.orderId,
    customerName: order.customer.name,
    status: order.orderStatus,
    items: order.items
  });

  return (
    <div className="space-y-6">
      <Link 
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-[#defc3e] hover:underline"
      >
        <ArrowLeft size={20} />
        Back to Orders
      </Link>

      <h1 className="text-5xl font-bebas text-[#defc3e]">
        Order #{order._id.toString().substring(0, 8)}...
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
            <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Customer Information</h3>
            <div className="space-y-3 text-white">
              <div>
                <span className="text-[#6b6b6b]">Name:</span> {order.customer.name}
              </div>
              <div>
                <span className="text-[#6b6b6b]">Email:</span> {order.customer.email}
              </div>
              <div>
                <span className="text-[#6b6b6b]">Phone:</span> {order.customer.phone}
              </div>
              <div>
                <span className="text-[#6b6b6b]">WhatsApp:</span> {order.customer.whatsappNumber}
              </div>
              <div>
                <span className="text-[#6b6b6b]">Address:</span>
                <div className="mt-1">
                  {order.customer.address.street}<br />
                  {order.customer.address.city}, {order.customer.address.province}<br />
                  {order.customer.address.postalCode && `${order.customer.address.postalCode}, `}
                  {order.customer.address.country}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
            <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-[#1a1a1a] last:border-0">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-white font-semibold">{item.productName}</div>
                    <div className="text-sm text-[#6b6b6b]">
                      Size: {item.size} | Color: {item.color}
                    </div>
                    <div className="text-sm text-[#6b6b6b]">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{formatCurrency(item.price)}</div>
                    <div className="text-sm text-[#6b6b6b]">
                      Total: {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 text-right">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Shipping:</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              {order.tip > 0 && (
                <div className="flex justify-between text-[#6b6b6b]">
                  <span>Tip:</span>
                  <span>{formatCurrency(order.tip)}</span>
                </div>
              )}
              <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-[#3a3a3a]">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
            <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[#6b6b6b]">Payment Method:</span>
                <div className="text-white mt-1">{formatPaymentMethod(order.paymentMethod)}</div>
              </div>

              {order.paymentMethod === 'jazzcash' && order.jazzcashTransactionId && (
                <div>
                  <span className="text-[#6b6b6b]">Transaction ID:</span>
                  <div className="text-white mt-1 font-mono">{order.jazzcashTransactionId}</div>
                </div>
              )}

              {order.paymentMethod === 'bank_deposit' && (
                <div className="text-sm text-[#6b6b6b] italic">
                  Payment proof sent via WhatsApp.
                </div>
              )}

              <div>
                <span className="text-[#6b6b6b]">Payment Status:</span>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${getPaymentStatusBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
            <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Order Status</h3>
            <OrderStatusUpdater 
              orderId={order._id.toString()} 
              initialStatus={order.orderStatus} 
            />
            <div className="mt-4 text-sm text-[#6b6b6b]">
              Created: {formatDate(order.createdAt)}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#282828] border border-[#3a3a3a] rounded-2xl p-6">
            <h3 className="text-[11px] text-[#6b6b6b] uppercase tracking-[2px] mb-4">Actions</h3>
            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={20} />
                Notify via WhatsApp
              </a>

              {(order.orderStatus === 'pending_confirmation' || order.orderStatus === 'confirmed') && (
                <CancelOrderButton orderId={order._id.toString()} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


