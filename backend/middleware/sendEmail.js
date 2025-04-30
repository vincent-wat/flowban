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
    const inviteLink = `https://yourfrontend.com/org-invite?token=${token}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "You're invited to join an organization on Flowban",
      html: `<p>You have been invited to join an organization. Click below to accept the invite:</p>
             <a href="${inviteLink}">Accept Invitation</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Organization invite email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending organization invite email:", error);
    throw new Error("Failed to send organization invite email");
  }
}

async function sendKanbanInvite(email, token, role) {
  try {
    const inviteLink = `https://yourfrontend.com/kanban-invite?token=${token}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "You are invited to join a KanBan board on Flowban",
      html: `<p> You have been invited to join a Kanban board with the role of ${role}. Click below to accept the invite:<p>
            <a href = "${inviteLink}"> Accept Invitation</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Kanban invite email sent successfully to:", email);
  } catch (error) {
    console.log("Error sending the kanban invite email:", error);
  }
}

module.exports = { sendOrganizationInviteEmail, sendKanbanInvite };
