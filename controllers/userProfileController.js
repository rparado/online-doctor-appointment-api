import { UserProfile, User } from '../models/index.js';

export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    firstName,
    middleName,
    lastName,
    birthDate,
    age,
    phoneNumber,
    avatar,
    address,
    gender
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: 'failed', message: 'User not found' });

    const avatarFilename = req.file ? req.file.filename : null;

    const [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        firstName,
        middleName,
        lastName,
        birthDate,
        age,
        phoneNumber,
        avatar: avatarFilename,
        address,
        gender
      }
    });

    if (!created) {
      await profile.update({
        firstName,
        middleName,
        lastName,
        birthDate,
        age,
        phoneNumber,
        ...(avatarFilename && { avatar: avatarFilename }),
        address,
        gender
      });
    }

    await user.update({ isProfileUpdated: 1 });

    return res.json({
      status: 'success',
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error',
      error: error.message
    });
  }
};
