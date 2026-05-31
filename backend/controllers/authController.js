import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, apartmentId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      apartmentId,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartmentId: user.apartmentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartmentId: user.apartmentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth — Step 1: verify token, check if new or existing user
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user — log them in directly
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        isNewUser: false,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          apartmentId: user.apartmentId,
          avatar: user.profile?.avatar || picture,
          communityType: user.communityType,
          communityName: user.communityName,
        },
      });
    }

    // New user — return Google data for onboarding form (do NOT save yet)
    return res.status(200).json({
      success: true,
      isNewUser: true,
      googleData: {
        googleId,
        name,
        email,
        avatar: picture,
      },
    });

  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ message: 'Google authentication failed. Please try again.' });
  }
};

// Google OAuth — Step 2: complete profile and save new user
export const googleComplete = async (req, res) => {
  try {
    const {
      googleId,
      name,
      email,
      avatar,
      communityType,
      communityId,
      communityName,
      role,
    } = req.body;

    // Validate required fields
    if (!googleId || !email || !communityType || !communityId || !communityName) {
      return res.status(400).json({ message: 'All community fields are required' });
    }

    // Double-check user doesn't already exist
    const existing = await User.findOne({ email });
    if (existing) {
      const token = generateToken(existing._id, existing.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: existing._id,
          name: existing.name,
          email: existing.email,
          role: existing.role,
          apartmentId: existing.apartmentId,
          avatar: existing.profile?.avatar || avatar,
        },
      });
    }

    // Map role from onboarding to system roles
    const roleMap = {
      'Member':            'resident',
      'Community Admin':   'admin',
      'Moderator':         'admin',
    };
    const systemRole = roleMap[role] || 'resident';

    // Create the new user
    const user = await User.create({
      name,
      email,
      password: `google_oauth_${googleId}_${Date.now()}`,
      googleId,
      role: systemRole,
      communityType,
      communityId,
      communityName,
      profile: { avatar },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar,
        communityType: user.communityType,
        communityId: user.communityId,
        communityName: user.communityName,
      },
    });
  } catch (error) {
    console.error('Google complete error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
