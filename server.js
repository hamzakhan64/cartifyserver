const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('🌍 Environment checks:', {
    port: process.env.PORT,
    mongo: process.env.MONGO_URI ? 'Present' : 'Missing',
    cwd: process.cwd()
});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const session = require('express-session');
const passport = require('./config/passport');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connect Database
connectDB();

// MongoDB connection listeners
const mongoose = require('mongoose');
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected!');
});
mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected!');
});

// ✅ CORS config with same options for both middleware and preflight
const corsOptions = {
    origin: "https://cartify-jet.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ preflight now uses same config

app.use(express.json());

// Session and Passport middleware
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000; // ✅ fixed missing PORT variable
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

module.exports = app;