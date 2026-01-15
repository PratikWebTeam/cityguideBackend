const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

/**
 * Determine if SendGrid should be used
 */
const useSendGrid =
  !!process.env.SENDGRID_API_KEY &&
  process.env.SENDGRID_API_KEY.startsWith('SG.') &&
  !!process.env.SENDGRID_FROM_EMAIL;

/**
 * Debug info (safe to keep)
 */
console.log('🔍 Email Configuration Check');
console.log('  useSendGrid:', useSendGrid);
console.log('  SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
console.log('  SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'NOT SET');
console.log('  EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');

/**
 * Gmail transporter (LOCAL DEV ONLY)
 */
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send OTP Email
 */
const sendOTPEmail = async (email, name, otp) => {
  try {
    // Always log OTP (dev friendly)
    console.log('\n' + '='.repeat(60));
    console.log('📧 OTP EMAIL');
    console.log('='.repeat(60));
    console.log(`👤 To: ${email}`);
    console.log(`📝 Name: ${name}`);
    console.log(`🔐 OTP Code: ${otp}`);
    console.log(`⏰ Expires: 10 minutes`);
    console.log('='.repeat(60) + '\n');

    /**
     * Email HTML
     */
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;">
          <div style="background:#667eea; color:white; padding:20px; text-align:center;">
            <h1>🏙️ CityGuide</h1>
            <p>Email Verification</p>
          </div>
          <div style="padding:30px; color:#333;">
            <h2>Hello ${name},</h2>
            <p>Your OTP code is:</p>
            <div style="font-size:32px; font-weight:bold; letter-spacing:6px; text-align:center; margin:20px 0;">
              ${otp}
            </div>
            <p>This code is valid for <strong>10 minutes</strong>.</p>
            <p>If you didn’t request this, please ignore this email.</p>
            <p>— CityGuide Team</p>
          </div>
          <div style="text-align:center; padding:15px; font-size:12px; color:#777;">
            © 2026 CityGuide
          </div>
        </div>
      </body>
      </html>
    `;

    /**
     * ===============================
     * SENDGRID (PRODUCTION)
     * ===============================
     */
    if (useSendGrid) {
      console.log('📧 Sending via SendGrid');

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, // MUST be verified
        subject: 'Verify Your CityGuide Account',
        html: htmlTemplate,
      };

      await sgMail.send(msg);
      console.log('✅ Email sent via SendGrid');

      return { success: true, provider: 'sendgrid' };
    }

    /**
     * ===============================
     * DEVELOPMENT MODE (NO EMAIL)
     * ===============================
     */
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ DEV MODE: Email not sent (no credentials)');
      return { success: true, provider: 'dev-console' };
    }

    /**
     * ===============================
     * GMAIL (LOCAL DEV ONLY)
     * ===============================
     */
    console.log('📧 Sending via Gmail (DEV ONLY)');

    const transporter = createGmailTransporter();

    await transporter.sendMail({
      from: `"CityGuide" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your CityGuide Account',
      html: htmlTemplate,
    });

    console.log('✅ Email sent via Gmail');
    return { success: true, provider: 'gmail' };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail };
