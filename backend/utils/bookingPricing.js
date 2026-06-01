/**
 * Single source of truth for ticket unit price and booking totals.
 */

function getUnitPrice(event, ticketType) {
  const base = Number(event?.price) || 0;
  const type = ticketType || 'Normal';

  if (type === 'VIP') {
    const vip = Number(event?.vipPrice);
    return vip > 0 ? vip : base + 300;
  }
  if (type === 'VVIP') {
    const vvip = Number(event?.vvipPrice);
    return vvip > 0 ? vvip : base + 600;
  }
  return base;
}

function calculateBookingTotal(event, quantity, ticketType) {
  const qty = Math.max(1, Number(quantity) || 1);
  const unitPrice = getUnitPrice(event, ticketType);
  const subtotal = unitPrice * qty;

  const minTickets = Number(event?.offerMinTickets) || 0;
  const discountPct = Number(event?.offerDiscount) || 0;
  let discountAmount = 0;

  if (minTickets > 0 && discountPct > 0 && qty >= minTickets) {
    discountAmount = (subtotal * discountPct) / 100;
  }

  const totalPrice = Math.round((subtotal - discountAmount) * 100) / 100;

  return {
    unitPrice,
    subtotal,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalPrice,
  };
}

module.exports = {
  getUnitPrice,
  calculateBookingTotal,
};
