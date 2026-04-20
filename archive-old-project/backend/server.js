import app from './app.js';
import connectDB from './config/db.js';

/**
 * Senior Backend Engineer Refactor
 * Goal: Reliable system startup, clear logging, and health monitoring.
 */

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // 1. Ensure server starts only after MongoDB connects
        await connectDB();
        console.log('MongoDB connected successfully');

        // 2. Start listening on the designated PORT
        const server = app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });

        // 3. Handle unhandled promise rejections properly
        process.on('unhandledRejection', (err) => {
            console.error(`Unhandled Rejection Error: ${err.message}`);
            // Graceful shutdown
            server.close(() => process.exit(1));
        });

    } catch (error) {
        console.error(`Startup Error: ${error.message}`);
        process.exit(1);
    }
};

// Initiate server startup
startServer();
