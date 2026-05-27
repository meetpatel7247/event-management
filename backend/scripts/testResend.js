require('dotenv').config();
const fetch = globalThis.fetch;

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  const testEmail = process.env.TEST_EMAIL || 'meetjpatel2406@gmail.com';

  console.log('🔑 RESEND_API_KEY present:', !!apiKey, '| Length:', apiKey ? apiKey.length : 0);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vibe Events <onboarding@resend.dev>',
        to: [testEmail],
        subject: '🎉 Vibe Events – Resend Test Email',
        html: '<div style="font-family:sans-serif;padding:2rem"><h2 style="color:#6366f1">✅ Resend is Working!</h2><p>This test confirms Resend HTTP API is configured correctly on your server.</p><p>Booking confirmation emails will now be delivered reliably!</p></div>',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('❌ Resend API Error:', JSON.stringify(data, null, 2));
    } else {
      console.log('✅ Email sent successfully via Resend!');
      console.log('   → Email ID:', data.id);
      console.log('   → Sent to:', testEmail);
    }
  } catch (err) {
    console.error('❌ Network Error:', err.message);
  }
}

testResend();
