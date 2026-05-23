const QRCode = require('qrcode');

// ─── Build HTML with QR embedded as base64 data URL ───────────────────────────
function buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 2rem; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #6366f1; margin-top: 0; font-size: 1.75rem;">🎉 Ticket Confirmation</h2>
      <p>Hi <strong style="color: #0f172a;">${name}</strong>,</p>
      <p>Your booking for <strong style="color: #6366f1;">${eventTitle}</strong> is confirmed!</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
      <p style="margin: 0.5rem 0;"><strong>Tickets:</strong> ${quantity}</p>
      <p style="margin: 0.5rem 0;"><strong>Booking ID:</strong> <code style="background:#f1f5f9; padding:0.2rem 0.4rem; border-radius:4px; font-weight:700;">${bookingId}</code></p>
      <br/>
      <p style="font-weight: 600; margin-bottom: 0.5rem;">Present this QR code at the event entrance:</p>
      <div style="text-align: center; margin: 1.5rem 0;">
        <img src="${qrDataUrl}" alt="Ticket QR Code" style="width:220px; height:220px; border:2px solid #e2e8f0; padding:12px; border-radius:12px;" />
      </div>
      <p style="color:#64748b; font-size:0.875rem; text-align:center; margin-top:2rem;">Thank you for booking with Vibe Events!</p>
    </div>
  `;
}

// ─── 1. Brevo HTTP API (free 300/day, any email, works on Render) ─────────────
async function sendViaBrevo(to, toName, subject, html) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY not set');

  const senderName = process.env.SMTP_SENDER_NAME || 'Vibe Events';
  const senderEmail = process.env.SMTP_USER || 'meetp7247@gmail.com';

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent: html,
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Brevo API error ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// ─── 2. Gmail SMTP (works on localhost) ───────────────────────────────────────
let cachedTransporter = null;
async function getGmailTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const nodemailer = require('nodemailer');
  const dns = require('dns');
  if (dns && dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
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

// ─── 3. Resend HTTP API (free 100/day, but restricted to verified emails on free plan) ──
async function sendViaResend(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');

  const senderName = process.env.SMTP_SENDER_NAME || 'Vibe Events';
  const payload = {
    from: `"${senderName}" <onboarding@resend.dev>`,
    to: [to],
    subject,
    html,
  };

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

// ─── Main entry point ─────────────────────────────────────────────────────────
async function sendBookingConfirmation(email, name, eventTitle, quantity, bookingId) {
  try {
    const qrDataUrl = await QRCode.toDataURL(bookingId.toString(), {
      color: { dark: '#000000', light: '#ffffff' },
    });

    const subject = `Your Ticket is Booked! - ${eventTitle}`;
    const html = buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl);
    const senderName = process.env.SMTP_SENDER_NAME || 'Vibe Events';
    const smtpFrom = `"${senderName}" <${process.env.SMTP_USER}>`;

    // ── Strategy 1: Brevo HTTP API (best for production – any email, no domain needed) ──
    if (process.env.BREVO_API_KEY) {
      try {
        console.log(`✉️ Sending via Brevo to ${email}...`);
        const info = await sendViaBrevo(email, name, subject, html);
        console.log('✅ Brevo email sent:', info.messageId || JSON.stringify(info));
        return null;
      } catch (err) {
        console.warn('⚠️ Brevo failed:', err.message);
      }
    }

    // ── Strategy 2: Gmail SMTP (works locally, may be blocked on cloud) ──
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log(`✉️ Trying Gmail SMTP to ${email}...`);
        const transporter = await getGmailTransporter();
        const info = await transporter.sendMail({ from: smtpFrom, to: email, subject, html });
        console.log('✅ Gmail SMTP sent:', info.messageId);
        return null;
      } catch (err) {
        console.warn('⚠️ Gmail SMTP failed:', err.message);
      }
    }

    // ── Strategy 3: Resend (last resort – only verified emails on free plan) ──
    if (process.env.RESEND_API_KEY) {
      try {
        console.log(`✉️ Trying Resend to ${email}...`);
        const info = await sendViaResend(email, subject, html);
        console.log('✅ Resend sent:', info.id);
        return null;
      } catch (err) {
        console.warn('⚠️ Resend failed:', err.message);
      }
    }

    console.warn('⚠️ All email methods failed or no credentials set.');
    return null;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return null;
  }
}

module.exports = { sendBookingConfirmation };
