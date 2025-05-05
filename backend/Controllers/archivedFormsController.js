const { ArchivedForm, User } = require("../models");

const getByTemplateId = async (req, res) => {
  const { templateId } = req.params;

  try {
    const forms = await ArchivedForm.findAll({
      where: { template_id: templateId },
      include: [
        {
          model: User,
          as: "submitter",
          attributes: ["id", "email", "first_name", "last_name"],
        },
      ],
      order: [["archived_at", "DESC"]],
    });

    res.json(forms);
  } catch (err) {
    console.error("Error fetching archived forms:", err);
    res.status(500).json({ error: "Failed to retrieve archived forms." });
  }
};

module.exports = {
  getByTemplateId,
};
