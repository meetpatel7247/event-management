const QRCode = require('qrcode');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

function getSenderEmail() {
  return (
    process.env.BREVO_SENDER_EMAIL ||
    process.env.SMTP_USER ||
    process.env.RESEND_FROM_EMAIL ||
    ''
  ).trim();
}

function getSenderName() {
  return process.env.SMTP_SENDER_NAME || process.env.BREVO_SENDER_NAME || 'Vibe Events';
}

// ─── Build HTML with QR embedded as base64 data URL ───────────────────────────
function buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl) {
  const safeName = name || 'Guest';
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 2rem; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #6366f1; margin-top: 0; font-size: 1.75rem;">🎉 Ticket Confirmation</h2>
      <p>Hi <strong style="color: #0f172a;">${safeName}</strong>,</p>
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

async function buildQrDataUrl(bookingId) {
  return QRCode.toDataURL(String(bookingId), { width: 220, margin: 2 });
}

function getBrevoKey() {
  return (process.env.BREVO_API_KEY || '').trim();
}

function isBrevoSmtpKey(key) {
  return key.startsWith('xsmtpsib-');
}

function getBrevoSmtpLogin() {
  return (
    process.env.BREVO_SMTP_LOGIN ||
    process.env.BREVO_SENDER_EMAIL ||
    process.env.SMTP_USER ||
    ''
  ).trim();
}

// ─── 1a. Brevo SMTP relay (xsmtpsib- keys from Brevo → SMTP & API) ───────────
let cachedBrevoTransporter = null;
async function getBrevoSmtpTransporter() {
  if (cachedBrevoTransporter) return cachedBrevoTransporter;
  const nodemailer = require('nodemailer');
  const smtpKey = getBrevoKey();
  const smtpLogin = getBrevoSmtpLogin();
  if (!smtpKey || !smtpLogin) {
    throw new Error('BREVO_API_KEY (xsmtpsib) and BREVO_SENDER_EMAIL or SMTP_USER are required');
  }

  cachedBrevoTransporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: { user: smtpLogin, pass: smtpKey },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  return cachedBrevoTransporter;
}

async function sendViaBrevoSmtp(to, subject, html) {
  const senderEmail = getSenderEmail();
  if (!senderEmail) {
    throw new Error('Set BREVO_SENDER_EMAIL or SMTP_USER to your verified Brevo sender address');
  }
  if (!getBrevoSmtpLogin()) {
    throw new Error(
      'Set BREVO_SMTP_LOGIN to the exact Login shown in Brevo → SMTP & API → SMTP (not always your Gmail)'
    );
  }
  try {
    const transporter = await getBrevoSmtpTransporter();
    const from = `"${getSenderName()}" <${senderEmail}>`;
    const info = await transporter.sendMail({ from, to, subject, html });
    return { provider: 'brevo-smtp', messageId: info.messageId };
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('Authentication failed')) {
      throw new Error(
        'Brevo SMTP login failed. Set BREVO_SMTP_LOGIN to the Login from Brevo → SMTP & API → SMTP.'
      );
    }
    if (msg.includes('Unauthorized IP')) {
      throw new Error(
        'Brevo blocked this server IP. In Brevo go to SMTP & API → Security → disable IP restriction, or add your host IP to authorized addresses.'
      );
    }
    throw err;
  }
}

// ─── 1b. Brevo HTTP API (xkeysib- keys from Brevo → API Keys) ────────────────
async function sendViaBrevoApi(to, toName, subject, html) {
  const apiKey = getBrevoKey();
  if (!apiKey) throw new Error('BREVO_API_KEY not set');

  const senderEmail = getSenderEmail();
  if (!senderEmail) {
    throw new Error('Set BREVO_SENDER_EMAIL or SMTP_USER to your verified Brevo sender address');
  }

  const payload = {
    sender: { name: getSenderName(), email: senderEmail },
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
  return { provider: 'brevo-api', messageId: data.messageId };
}

async function sendViaBrevo(to, toName, subject, html) {
  if (isBrevoSmtpKey(getBrevoKey())) {
    return sendViaBrevoSmtp(to, subject, html);
  }
  return sendViaBrevoApi(to, toName, subject, html);
}

// ─── 2. Gmail SMTP (works on localhost; often blocked on cloud hosts) ─────────
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

async function sendViaGmail(to, subject, html) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS not set');
  }
  const senderEmail = process.env.SMTP_USER;
  const smtpFrom = `"${getSenderName()}" <${senderEmail}>`;
  const transporter = await getGmailTransporter();
  const info = await transporter.sendMail({ from: smtpFrom, to, subject, html });
  return { provider: 'gmail', messageId: info.messageId };
}

// ─── 3. Resend HTTP API ───────────────────────────────────────────────────────
async function sendViaResend(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const payload = {
    from: `"${getSenderName()}" <${fromEmail}>`,
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
  return { provider: 'resend', messageId: data.id };
}

function hasAnyEmailProvider() {
  return !!(
    process.env.BREVO_API_KEY ||
    (process.env.SMTP_USER && process.env.SMTP_PASS) ||
    process.env.RESEND_API_KEY
  );
}

/**
 * Sends booking confirmation email. Returns { success, provider?, error? }.
 */
async function sendBookingConfirmation(email, name, eventTitle, quantity, bookingId) {
  const to = normalizeEmail(email);
  if (!isValidEmail(to)) {
    return { success: false, error: 'Invalid email address' };
  }

  if (!hasAnyEmailProvider()) {
    console.error('❌ No email provider configured (BREVO_API_KEY, SMTP_USER+SMTP_PASS, or RESEND_API_KEY)');
    return {
      success: false,
      error: 'Email service is not configured on the server. Ask the site admin to add BREVO_API_KEY.',
    };
  }

  try {
    const qrDataUrl = await buildQrDataUrl(bookingId);
    const subject = `Your Ticket is Booked! - ${eventTitle}`;
    const html = buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl);
    const displayName = (name || 'Guest').trim() || 'Guest';

    const attempts = [];

    if (process.env.BREVO_API_KEY) {
      attempts.push(async () => {
        console.log(`✉️ Sending via Brevo to ${to}...`);
        const info = await sendViaBrevo(to, displayName, subject, html);
        console.log('✅ Brevo email sent:', info.messageId || 'ok');
        return info;
      });
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      attempts.push(async () => {
        console.log(`✉️ Trying Gmail SMTP to ${to}...`);
        const info = await sendViaGmail(to, subject, html);
        console.log('✅ Gmail SMTP sent:', info.messageId);
        return info;
      });
    }

    if (process.env.RESEND_API_KEY) {
      attempts.push(async () => {
        console.log(`✉️ Trying Resend to ${to}...`);
        const info = await sendViaResend(to, subject, html);
        console.log('✅ Resend sent:', info.messageId);
        return info;
      });
    }

    let lastError = 'All email providers failed';
    for (const attempt of attempts) {
      try {
        const result = await attempt();
        return { success: true, provider: result.provider, messageId: result.messageId };
      } catch (err) {
        lastError = err.message;
        console.warn('⚠️ Email provider failed:', err.message);
      }
    }

    return { success: false, error: lastError };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendBookingConfirmation,
  isValidEmail,
  normalizeEmail,
  hasAnyEmailProvider,
};
