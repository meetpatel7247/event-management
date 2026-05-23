const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

let cachedTransporter = null;
let cachedTestAccount = null;

async function getTransporter() {
  if (cachedTransporter) {
    return { transporter: cachedTransporter, isTest: !process.env.SMTP_USER };
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    // Re-use a single test account created once
    console.log('🔄 Provisioning single Ethereal Test Account...');
    cachedTestAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: cachedTestAccount.user, // generated ethereal user
        pass: cachedTestAccount.pass, // generated ethereal password
      },
    });
  }

  return { transporter: cachedTransporter, isTest: !process.env.SMTP_USER };
}

async function sendBookingConfirmation(email, name, eventTitle, quantity, bookingId) {
  try {
    // Generate QR Code as Data URI
    const qrDataUrl = await QRCode.toDataURL(bookingId.toString(), {
      color: { dark: '#000000', light: '#ffffff' }
    });

    const { transporter, isTest } = await getTransporter();

    // Extract base64 part of the QR code for standard CID attachment embedding
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");

    const smtpUser = process.env.SMTP_USER;
    const mailOptions = {
      from: smtpUser ? `"${process.env.SMTP_SENDER_NAME || 'Vibe Events'}" <${smtpUser}>` : '"Vibe Events" <noreply@vibeevents.com>',
      to: email,
      subject: `Your Ticket is Booked! - ${eventTitle}`,
      html: `
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
            <img src="cid:ticket-qr" alt="Ticket QR Code" style="width: 220px; height: 220px; border: 2px solid #e2e8f0; padding: 12px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" />
          </div>
          <p style="color: #64748b; font-size: 0.875rem; text-align: center; margin-top: 2rem;">Thank you for booking with Vibe Events!</p>
        </div>
      `,
      attachments: [{
        filename: 'ticket-qr.png',
        content: Buffer.from(base64Data, 'base64'),
        cid: 'ticket-qr'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    if (isTest) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL: %s', previewUrl);
      return previewUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
}

module.exports = {
  sendBookingConfirmation
};
