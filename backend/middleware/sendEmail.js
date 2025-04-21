const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendInviteEmail(to, token) {
  const inviteLink = `https://yourfrontend.com/org-invite?token=${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "You're invited to join an organization on Flowban",
    html: `<p>You have been invited to join an organization. Click below to accept the invite:</p>
           <a href="${inviteLink}">Accept Invitation</a>`,
  };

  await transporter.sendMail(mailOptions);
}

// fucntion to send email invite for kanban board.
async function sendKanbanInviteEmail(to, token) {
  const inviteLink = `https://yourfrontend.com/board-invite?token=${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "You're invited to join a Kanban board on Flowban",
    html: `<p>You have been invited to join a Kanban board. Click below to accept the invite:</p>
           <a href="${inviteLink}">Accept Invitation</a>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendInviteEmail;
