const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log('Testing SMTP connection with:');
  console.log('- User:', smtpUser);
  console.log('- Password Length:', smtpPass ? smtpPass.length : 0);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 1500, // 1.5 seconds timeout
    greetingTimeout: 1500,
    socketTimeout: 3000,
  });

  try {
    console.log('🔄 Verifying transporter connection with timeouts...');
    await transporter.verify();
    console.log('✅ Connection is valid!');

    console.log('🔄 Sending test email...');
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME || 'Vibe Events'}" <${smtpUser}>`,
      to: 'meetjpatel2406@gmail.com', // send to your Gmail
      subject: 'Vibe Events - SMTP Test',
      text: 'This is a test email from Vibe Events SMTP test script.',
    });
    console.log('✅ Email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Test Failed:', error);
  }
}

testSMTP();
