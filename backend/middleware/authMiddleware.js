import User from '../models/User.js';

export const protect = async (req, res, next) => {
    // PAUSED AUTH: Injected a real user from DB for demo purposes
    try {
        // Find any user to act as the demo user
        let user = await User.findOne({ role: 'landlord' });
        
        // If no landlord exists, just create a mock ID
        if (!user) {
            req.user = { id: '65f1234567890abcdef12345', role: 'landlord' };
        } else {
            req.user = user;
        }
        
        return next();
    } catch (error) {
        return next();
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        // Always allow in paused mode
        next();
    };
};
