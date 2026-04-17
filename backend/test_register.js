import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const testRegister = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        const testUser = {
            name: 'Test Assistant',
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
            role: 'landlord'
        };
        
        const user = await User.create(testUser);
        console.log('User created:', user.email);
        
        await User.deleteOne({ _id: user._id });
        console.log('Cleaned up test user');
        
        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error.message);
        process.exit(1);
    }
};

testRegister();
