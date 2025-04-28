import { UserProfile, User } from '../models/index.js';

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { firstName, lastName, phone, address, birthDate, gender, avatar } = req.body;

    const userProfile = await UserProfile.findOne({ where: { userId } });

    if (!userProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not found',
      });
    }

    // Update profile fields
    await userProfile.update({
      firstName,
      lastName,
      phone,
      address,
      birthDate,
      gender,
      avatar
    });

    // Also update user status
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: 'User not found'
      });
    }
    user.isProfileUpdated = 1;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        userProfile: {
          id: userProfile.id,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          phone: userProfile.phone,
          address: userProfile.address,
          birthDate: userProfile.birthDate,
          gender: userProfile.gender,
          avatar: userProfile.avatar
        },
        user
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating profile',
      error: error.message
    });
  }
};
