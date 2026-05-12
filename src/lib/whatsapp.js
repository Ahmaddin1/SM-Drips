const STATUS_MESSAGES = {
  pending_confirmation: (name, orderId, itemsSummary) =>
    `Hi ${name}!  Your order at SM Drips (Order ID: ${orderId}) has been received!\n${itemsSummary}\nReply *CONFIRM* to confirm your order or *CANCEL* to cancel it.\n\nThank you for shopping with us! `,

  confirmed: (name, orderId, itemsSummary) =>
    `Hi ${name}!  Your SM Drips order (Order ID: ${orderId}) has been confirmed and is being prepared.\n${itemsSummary}\nWe'll notify you once it's shipped. Thank you! `,

  shipped: (name, orderId, itemsSummary) =>
    `Hi ${name}!  Your SM Drips order (Order ID: ${orderId}) is on its way!\n${itemsSummary}\nYou'll receive it soon. Thank you for shopping with us!`,

  delivered: (name, orderId, itemsSummary) =>
    `Hi ${name}!  Your SM Drips order (Order ID: ${orderId}) has been delivered!\n${itemsSummary}\nWe hope you love it. Thank you for shopping with us! `,

  cancelled: (name, orderId, itemsSummary) =>
    `Hi ${name}, your SM Drips order (Order ID: ${orderId}) has been cancelled as requested.\n${itemsSummary}\nIf this was a mistake, feel free to place a new order. Thank you! `,
};

export function buildWhatsAppLink({
  phone,
  orderId,
  customerName,
  status,
  items = [],
}) {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("92") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  const fullPhone = `92${digits}`;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = subtotal < 3000 ? 200 : 0;
  const total = subtotal + shippingCost;

  const itemsSummary =
    items.length > 0
      ? `\n Order Summary:\n${items.map((item) => `- ${item.productName} | Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity} | Rs. ${item.price * item.quantity}`).join("\n")}\n\nSubtotal: Rs. ${subtotal}\nShipping: ${shippingCost === 0 ? "Free 🎉" : `Rs. ${shippingCost}`}\nTotal: Rs. ${total}`
      : "";

  const messageBuilder = STATUS_MESSAGES[status];
  const message = messageBuilder
    ? messageBuilder(customerName, orderId, itemsSummary)
    : `Hi ${customerName}, your SM Drips order (Order ID: ${orderId}) status has been updated to: ${status}. Thank you! 🖤`;

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}
