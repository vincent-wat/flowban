const User = require('../models/User');

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { email, phone_number, first_name, last_name, user_roles } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      email,
      phone_number,
      first_name,
      last_name,
      user_roles,
    });

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  updateUser,
};
