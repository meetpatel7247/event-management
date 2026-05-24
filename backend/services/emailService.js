const QRCode = require('qrcode');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripEnv(value) {
  let v = String(value || '').trim();
  // Railway row editor sometimes saves values wrapped in quotes — strip repeatedly
  while (/^["']/.test(v) && /["']$/.test(v) && v.length >= 2) {
    v = v.slice(1, -1).trim();
  }
  return v.replace(/^["']+|["']+$/g, '');
}

function normalizeEmail(email) {
  return stripEnv(email).toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

function getSenderEmail() {
  return stripEnv(
    process.env.BREVO_SENDER_EMAIL ||
    process.env.SMTP_USER ||
    process.env.RESEND_FROM_EMAIL ||
    ''
  );
}

function getSenderName() {
  return process.env.SMTP_SENDER_NAME || process.env.BREVO_SENDER_NAME || 'Vibe Events';
}

// ─── Build HTML with QR embedded as base64 data URL ───────────────────────────
function getClientUrl() {
  return stripEnv(process.env.CLIENT_URL || 'https://meetpatel7247.github.io/event-management');
}

function buildEmailHtml(name, eventTitle, quantity, bookingId, qrDataUrl) {
  const safeName = name || 'Guest';
  const clientUrl = getClientUrl();
  const ticketUrl = `${clientUrl}/my-bookings`;
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 2.5rem; border-radius: 16px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span style="font-size: 3rem;">🎉</span>
        <h2 style="color: #6366f1; margin: 0.5rem 0 0 0; font-size: 1.85rem; font-weight: 800; letter-spacing: -0.025em;">Ticket Confirmation</h2>
        <p style="color: #64748b; margin: 0.25rem 0 0 0; font-size: 0.95rem;">Your reservation is secured!</p>
      </div>

      <p style="font-size: 1.05rem; line-height: 1.6;">Hi <strong style="color: #0f172a;">${safeName}</strong>,</p>
      <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">Your booking for <strong style="color: #6366f1;">${eventTitle}</strong> is successfully confirmed. Here are your booking details:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 0.5rem 0; color: #64748b; font-size: 0.95rem;">Event</td>
            <td style="padding: 0.5rem 0; text-align: right; font-weight: 700; color: #0f172a; font-size: 0.95rem;">${eventTitle}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; color: #64748b; font-size: 0.95rem;">Tickets Count</td>
            <td style="padding: 0.5rem 0; text-align: right; font-weight: 700; color: #0f172a; font-size: 0.95rem;">${quantity}x</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; color: #64748b; font-size: 0.95rem;">Booking ID</td>
            <td style="padding: 0.5rem 0; text-align: right; font-family: monospace; font-weight: 700; color: #6366f1; font-size: 0.95rem;">${bookingId}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin: 2rem 0; padding: 1.5rem; background: #faf5ff; border: 1px dashed #d8b4fe; border-radius: 12px;">
        <p style="font-weight: 700; color: #7c3aed; margin-top: 0; margin-bottom: 0.75rem; font-size: 1rem;">🎟️ Live Digital Ticket & QR Entrance Pass</p>
        <p style="color: #6b21a8; font-size: 0.875rem; margin-bottom: 1.25rem; line-height: 1.5;">Present the QR code below at the event gates or click the button to view your live tickets online.</p>
        <div style="display: inline-block; background: #ffffff; padding: 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
          <img src="${qrDataUrl}" alt="Ticket QR Code" style="width:200px; height:200px; display: block;" />
        </div>
        <div>
          <a href="${ticketUrl}" target="_blank" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 0.85rem 2rem; font-weight: 700; text-decoration: none; border-radius: 9999px; font-size: 0.95rem; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2); transition: all 0.2s;">
            View Ticket & Bookings Online →
          </a>
        </div>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0;" />
      <p style="color:#64748b; font-size:0.875rem; text-align:center; margin:0; line-height: 1.5;">Thank you for booking with <strong style="color: #4f46e5;">Vibe Events</strong>!<br/>If you have any questions, simply reply to this email.</p>
    </div>
  `;
}

async function buildQrDataUrl(bookingId) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=1&data=${encodeURIComponent(String(bookingId))}`;
}


function isCloudHost() {
  return !!(
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_SERVICE_ID ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.RAILWAY_PUBLIC_DOMAIN ||
    process.env.RENDER ||
    process.env.VERCEL ||
    process.env.FLY_APP_NAME
  );
}

/** Brevo sometimes shows a base64 JSON blob — extract xkeysib- from it */
function normalizeBrevoHttpKey(raw) {
  const value = stripEnv(raw);
  if (!value) return '';
  if (isBrevoHttpKey(value)) return value;

  if (value.startsWith('eyJ')) {
    try {
      const json = JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
      if (json.api_key && isBrevoHttpKey(json.api_key)) return stripEnv(json.api_key);
    } catch (_) {
      /* not valid base64 json */
    }
  }

  return '';
}

function isBrevoSmtpKey(key) {
  return key.startsWith('xsmtpsib-');
}

function isBrevoHttpKey(key) {
  return key.startsWith('xkeysib-');
}

/** HTTP API key (xkeysib) — works on Railway; SMTP ports are blocked there */
function getBrevoHttpKey() {
  const fromDedicated = normalizeBrevoHttpKey(process.env.BREVO_HTTP_API_KEY);
  if (fromDedicated) return fromDedicated;
  return normalizeBrevoHttpKey(process.env.BREVO_API_KEY);
}

function getBrevoHttpKeySetupError() {
  const raw = stripEnv(process.env.BREVO_HTTP_API_KEY);
  if (raw && !normalizeBrevoHttpKey(raw)) {
    return 'BREVO_HTTP_API_KEY is wrong. Paste the xkeysib-... key OR the eyJ base64 blob from Brevo (we decode it automatically after redeploy).';
  }
  if (!getBrevoHttpKey() && isCloudHost()) {
    return 'Add BREVO_HTTP_API_KEY on Railway (xkeysib-... from Brevo → API Keys).';
  }
  return '';
}

/** SMTP relay key (xsmtpsib) — works on localhost only; blocked on Railway */
function getBrevoSmtpKey() {
  const dedicated = stripEnv(process.env.BREVO_SMTP_KEY);
  if (dedicated) return dedicated;
  const legacy = stripEnv(process.env.BREVO_API_KEY);
  if (legacy && isBrevoSmtpKey(legacy)) return legacy;
  return '';
}

function getBrevoSmtpLogin() {
  return stripEnv(
    process.env.BREVO_SMTP_LOGIN ||
    process.env.BREVO_SENDER_EMAIL ||
    process.env.SMTP_USER ||
    ''
  );
}

// ─── 1a. Brevo SMTP relay (xsmtpsib- keys from Brevo → SMTP & API) ───────────
let cachedBrevoTransporter = null;
async function getBrevoSmtpTransporter() {
  if (cachedBrevoTransporter) return cachedBrevoTransporter;
  const nodemailer = require('nodemailer');
  const smtpKey = getBrevoSmtpKey();
  const smtpLogin = getBrevoSmtpLogin();
  if (!smtpKey || !smtpLogin) {
    throw new Error('BREVO_SMTP_KEY (xsmtpsib) and BREVO_SMTP_LOGIN are required');
  }

  cachedBrevoTransporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
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
  const apiKey = getBrevoHttpKey();
  if (!apiKey) {
    throw new Error(
      'BREVO_HTTP_API_KEY not set. In Brevo go to SMTP & API → API Keys, create a key (starts with xkeysib-), add it on Railway.'
    );
  }

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
  const setupError = getBrevoHttpKeySetupError();
  if (setupError) throw new Error(setupError);

  if (getBrevoHttpKey()) {
    return sendViaBrevoApi(to, toName, subject, html);
  }
  if (isCloudHost()) {
    throw new Error(
      'Add BREVO_HTTP_API_KEY on Railway with your xkeysib-... key from Brevo → API Keys (SMTP is blocked on cloud).'
    );
  }
  if (getBrevoSmtpKey()) {
    return sendViaBrevoSmtp(to, subject, html);
  }
  throw new Error('No Brevo credentials configured');
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
      user: stripEnv(process.env.SMTP_USER),
      pass: stripEnv(process.env.SMTP_PASS),
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
  const apiKey = stripEnv(process.env.RESEND_API_KEY);
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
    getBrevoHttpKey() ||
    getBrevoSmtpKey() ||
    (stripEnv(process.env.SMTP_USER) && stripEnv(process.env.SMTP_PASS)) ||
    stripEnv(process.env.RESEND_API_KEY)
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

    const failures = [];

    const hasBrevoHttp = !!getBrevoHttpKey();
    const hasBrevoSmtp = !!getBrevoSmtpKey();
    const brevoSetupError = getBrevoHttpKeySetupError();

    if (hasBrevoHttp || hasBrevoSmtp || brevoSetupError) {
      attempts.push({
        name: 'brevo',
        run: async () => {
          console.log(`✉️ Sending via Brevo to ${to}...`);
          const info = await sendViaBrevo(to, displayName, subject, html);
          console.log('✅ Brevo email sent:', info.messageId || 'ok');
          return info;
        },
      });
    }

    // SMTP is blocked on Railway/Render — skip to avoid 10s+ timeouts
    if (!isCloudHost() && stripEnv(process.env.SMTP_USER) && stripEnv(process.env.SMTP_PASS)) {
      attempts.push({
        name: 'gmail',
        run: async () => {
          console.log(`✉️ Trying Gmail SMTP to ${to}...`);
          const info = await sendViaGmail(to, subject, html);
          console.log('✅ Gmail SMTP sent:', info.messageId);
          return info;
        },
      });
    }

    if (stripEnv(process.env.RESEND_API_KEY)) {
      attempts.push({
        name: 'resend',
        run: async () => {
          console.log(`✉️ Trying Resend to ${to}...`);
          const info = await sendViaResend(to, subject, html);
          console.log('✅ Resend sent:', info.messageId);
          return info;
        },
      });
    }

    let lastError = 'All email providers failed';
    for (const { name, run } of attempts) {
      try {
        const result = await run();
        return {
          success: true,
          provider: result.provider,
          messageId: result.messageId,
          failures: failures.length ? failures : undefined,
        };
      } catch (err) {
        lastError = err.message;
        failures.push({ provider: name, error: err.message });
        console.warn(`⚠️ Email provider ${name} failed:`, err.message);
      }
    }

    return { success: false, error: lastError, failures };
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
  isCloudHost,
  getBrevoHttpKey,
  getBrevoHttpKeySetupError,
};
