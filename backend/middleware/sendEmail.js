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
      from: process.env.EMAIL || "workflowban@gmail.com",
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

async function sendKanbanInvite(email, token, role) {
  try {
    const inviteLink = `https://localhost:3001/kanban-invite?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL || "workflowban@gmail.com",
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

async function sendAssignedTaskEmail(email, task) {
  console.log("Sending assigned task email to:", email);
  console.log("Task details:", task);
  try {
    const mailOptions = {
      from: process.env.EMAIL || "workflowban@gmail.com",
      to: email,
      subject: "You have been assigned a new task on Flowban",
      html: `<p>You have been assigned a new task on Flowban:</p>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Assigned task email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending assigned task email:", error);
    throw new Error("Failed to send assigned task email");
  }
}

module.exports = {
  sendOrganizationInviteEmail,
  sendKanbanInvite,
  sendAssignedTaskEmail,
};
