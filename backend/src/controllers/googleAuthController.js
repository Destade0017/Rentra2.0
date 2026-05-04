import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper — reuse the same JWT format as existing auth
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Sign in / sign up via Google OAuth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        res.status(400);
        throw new Error('Google credential is required');
    }

    // 1. Verify the Google ID token
    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (err) {
        res.status(401);
        throw new Error('Invalid Google credential');
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
        res.status(400);
        throw new Error('Google account does not have an email address');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find existing user by email (covers both Google and email/password users)
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
        // If existing user signed up with email/password (no googleId), link accounts
        if (!user.googleId) {
            user.googleId = googleId;
            if (picture && !user.profileImage) user.profileImage = picture;
            await user.save();
        }
    } else {
        // 3. Create a new user for first-time Google sign-in
        user = await User.create({
            name: name || 'Rentra User',
            email: normalizedEmail,
            googleId,
            profileImage: picture || null,
            // No password — Google users authenticate via OAuth
        });
    }

    // 4. Issue the same JWT format as existing login
    res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        }
    });
});
