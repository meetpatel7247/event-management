const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

async function sendBookingConfirmation(email, name, eventTitle, quantity, bookingId) {
  try {
    // Generate QR Code as Data URI
    const qrDataUrl = await QRCode.toDataURL(bookingId.toString(), {
      color: { dark: '#000000', light: '#ffffff' }
    });

    // Create a test account for ethereal email
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const mailOptions = {
      from: '"Vibe Events" <noreply@vibeevents.com>',
      to: email,
      subject: `Your Ticket is Booked! - ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ticket Confirmation</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
          <p><strong>Tickets:</strong> ${quantity}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <br/>
          <p>Please present the QR code below at the event entrance:</p>
          <img src="${qrDataUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px; border: 1px solid #ccc; padding: 10px; border-radius: 8px;" />
          <br/>
          <p>Thank you for booking with us!</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
}

module.exports = {
  sendBookingConfirmation
};
