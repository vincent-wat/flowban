const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/*
Check if user is in organization
Generate jwt token with userid and organizationid embedded
Create link and send email to user
*/
async function sendOrganizationInviteEmail(email, token) {
  try {
    const inviteLink = `https://localhost:3001/org-invite?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL || 'workflowban@gmail.com',
      to: email,
      subject: "You're invited to join an organization on Flowban",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #C51D34;">Flowban Organization Invitation</h2>
          <p>You have been invited to join an organization in Flowban. Click the button below to accept the invitationssssssssss:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #C51D34; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 15px 0;">Accept Invitation</a>
          <p>If you can't click the button, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${inviteLink}</p>
          <p>This invitation will expire in 48 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Organization invite email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending organization invite email:", error);
    throw new Error("Failed to send organization invite email");
  }
}

module.exports = sendOrganizationInviteEmail;
