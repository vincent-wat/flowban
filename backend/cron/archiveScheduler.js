// cron/archiveScheduler.js
const cron = require("node-cron");
const archiveCompletedForms = require("../scripts/archiveCompletedForms");

const startArchiveJob = () => {
  //2:00 AM
  /*cron.schedule("0 2 * * *", async () => {
    console.log("⏰ Running scheduled archive job...");
    await archiveCompletedForms();
  });*/

  // Uncomment for manual testing:
  // console.log("Running archive job manually for test");
   archiveCompletedForms();
};

module.exports = startArchiveJob;
