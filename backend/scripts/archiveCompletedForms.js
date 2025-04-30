const { FormInstance, ArchivedForm } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/archival.log');

const logToFile = (message) => {
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
};

const archiveCompletedForms = async () => {
  try {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const oldForms = await FormInstance.findAll({
        where: {
          status: 'Completed',
          updated_at: {
            [Op.lt]: twoWeeksAgo,
          },
        },
        include: [
          {
            association: 'template',
            attributes: ['name'],
          },
          {
            association: 'submitter',
            attributes: ['email'],
          },
        ],
        attributes: [
          'id',
          'template_id',
          'submitted_by',
          'status',
          'pdf_file_path',
          'denial_reason',
          'created_at',
        ],
      });
      
      

    for (const form of oldForms) {
        console.log("Archiving form ID:", form.id, "Created At:", form.created_at);
        await ArchivedForm.create({
            original_form_instance_id: form.id,
            template_id: form.template_id,
            submitted_by: form.submitted_by,
            status: form.status,
            pdf_file_path: form.pdf_file_path,
            denial_reason: form.denial_reason,
            created_at: form.created_at,
            archived_at: new Date(),
          });
          
        const templateName = form.template?.name || "Unknown Template";
        const submitterEmail = form.submitter?.email || "Unknown User";
          
        logToFile(
          `Archived form ID ${form.id} (Template: "${templateName}", Submitted By: ${submitterEmail})`
        );
          
      await form.destroy();
    }

    console.log(`Archived ${oldForms.length} forms.`);
  } catch (error) {
    console.error('Error archiving completed forms:', error);
  }
};

module.exports = archiveCompletedForms;
