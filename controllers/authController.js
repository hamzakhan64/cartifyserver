const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// signup() — Register a new user
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// login() — Authenticate user & get token
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// googleCallback() — Handle OAuth redirection
exports.googleCallback = (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log(`Backend: Redirecting user ${user.email} with token`);

    // Construct the user object for the frontend
    const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }));

    // Redirect to the frontend callback handler with the token and user data
    // Assuming frontend is running on http://localhost:5173 (standard Vite)
    const frontendUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173';
    res.redirect(`${frontendUrl}/google-callback?token=${token}&user=${userData}`);
};
