const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // In production, you might want to be more strict:
        // if (allowedOrigin === origin) return callback(null, true);
        
        // For flexibility during early deployment, we allow all for now but explain the transition
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('API Running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/tenants', require('./routes/tenantRoutes'));

// Error Middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
