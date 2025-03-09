import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"Student Registration System" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);

  console.log(`Email sent: ${info.messageId}`);

  return info;
};

// Welcome email template
export const getWelcomeEmailTemplate = (firstName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a5568; text-align: center;">Welcome to Student Registration System</h2>
      <p style="color: #4a5568; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #4a5568; font-size: 16px;">Thank you for registering with our Student Registration System. Your account has been successfully created.</p>
      <p style="color: #4a5568; font-size: 16px;">You can now log in to your account to update your profile information and enter your subject marks.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="#" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
      </div>
      <p style="color: #4a5568; font-size: 14px; margin-top: 30px; text-align: center;">If you have any questions, please contact our support team.</p>
      <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 20px;">© 2025 ABC Software (Pvt) LTD</p>
    </div>
  `;
};
