import { UserProfile, User } from '../models/index.js';
import { calculateAge } from '../utils/calculateAge.js';
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId; // Adjust based on your auth
    const {
      firstName,
      middleName,
      lastName,
      birthDate,
      phoneNumber,
      address,
      gender
    } = req.body;

    const avatar = req.file ? req.file.filename : undefined;

    const age = birthDate ? calculateAge(birthDate) : null;

    const profileData = {
      firstName,
      middleName,
      lastName,
      birthDate,
      age,
      phoneNumber,
      address,
      gender
    };

    if (avatar) profileData.avatar = avatar;

    // Update or create UserProfile
    const [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: { ...profileData, userId }
    });

    if (!created) {
      await profile.update(profileData);
    }

    // Set isProfileUpdated = 1
    await User.update({ isProfileUpdated: 1 }, { where: { id: userId } });

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { ...profile.toJSON(), avatarUrl: `/uploads/${avatar}` }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ status: 'failed', message: 'Server error', error: err.message });
  }
};
