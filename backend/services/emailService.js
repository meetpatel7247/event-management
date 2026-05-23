const QRCode = require('qrcode');

// ─── Resend HTTP API sender (works on Render – uses HTTPS port 443) ──────────
// NOTE: Resend does NOT support CID inline images. We embed QR as base64 data URL in HTML.
async function sendViaResend(to, from, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');

  const payload = { from, to: [to], subject, html };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Resend API error ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// ─── Nodemailer / Gmail SMTP sender (port 587 STARTTLS – works on Render too) ──
let cachedTransporter = null;
async function getGmailTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const nodemailer = require('nodemailer');
  const dns = require('dns');
  if (dns && dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

  // Use explicit host + port 587 (STARTTLS) instead of service:'gmail'
  // Render.com allows outbound port 587 but blocks port 465 (SSL)
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,           // STARTTLS (upgrades to TLS after connection)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  return cachedTransporter;
}

// ─── Build HTML with QR embedded as base64 data URL (works everywhere) ────────
function buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 2rem; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #6366f1; margin-top: 0; font-size: 1.75rem;">🎉 Ticket Confirmation</h2>
      <p>Hi <strong style="color: #0f172a;">${name}</strong>,</p>
      <p>Your booking for <strong style="color: #6366f1;">${eventTitle}</strong> is successfully confirmed!</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
      <p style="margin: 0.5rem 0;"><strong>Tickets Quantity:</strong> ${quantity}</p>
      <p style="margin: 0.5rem 0;"><strong>Booking ID:</strong> <code style="background-color: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-weight: 700;">${bookingId}</code></p>
      <br/>
      <p style="font-weight: 600; margin-bottom: 0.5rem;">Present this QR code at the event entrance:</p>
      <div style="text-align: center; margin: 1.5rem 0;">
        <img src="${qrDataUrl}" alt="Ticket QR Code" style="width: 220px; height: 220px; border: 2px solid #e2e8f0; padding: 12px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" />
      </div>
      <p style="color: #64748b; font-size: 0.875rem; text-align: center; margin-top: 2rem;">Thank you for booking with Vibe Events!</p>
    </div>
  `;
}

// ─── Main entry point ─────────────────────────────────────────────────────────
async function sendBookingConfirmation(email, name, eventTitle, quantity, bookingId) {
  try {
    // Generate QR Code as base64 data URL (works for both SMTP and Resend)
    const qrDataUrl = await QRCode.toDataURL(bookingId.toString(), {
      color: { dark: '#000000', light: '#ffffff' },
    });
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');

    const senderName = process.env.SMTP_SENDER_NAME || 'Vibe Events';
    const resendFrom = `"${senderName}" <onboarding@resend.dev>`;
    const smtpFrom = `"${senderName}" <${process.env.SMTP_USER || 'test@example.com'}>`;

    const subject = `Your Ticket is Booked! - ${eventTitle}`;

    // ── Strategy 1: Always try Gmail SMTP first (works on localhost AND Render port 587) ──
    // This allows sending to ANY user email address, unlike Resend free plan.
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log(`✉️ Trying Gmail SMTP to ${email}...`);
        // Use base64 data URL for QR so it renders in all email clients
        const htmlWithDataUrl = buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl);
        const transporter = await getGmailTransporter();
        const info = await transporter.sendMail({ from: smtpFrom, to: email, subject, html: htmlWithDataUrl });
        console.log('✅ Gmail SMTP email sent:', info.messageId);
        return null;
      } catch (err) {
        console.warn('⚠️ Gmail SMTP failed, trying Resend fallback...', err.message);
      }
    }

    // ── Strategy 2: Resend fallback (only sends to verified emails on free plan) ──
    if (process.env.RESEND_API_KEY) {
      console.log(`✉️ Falling back to Resend for ${email}...`);
      // Resend does NOT support CID – embed QR as base64 data URL directly in HTML
      const htmlWithDataUrl = buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl);
      const info = await sendViaResend(email, resendFrom, subject, htmlWithDataUrl);
      console.log('✅ Resend email sent:', info.id);
      return null;
    }

    console.warn('⚠️ No email credentials (SMTP_USER or RESEND_API_KEY) found. Email skipped.');
    return null;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return null;
  }
}

module.exports = { sendBookingConfirmation };
