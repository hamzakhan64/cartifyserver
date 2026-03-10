const express = require('express');
const router = express.Router();
const { signup, login, googleCallback } = require('../controllers/authController');
const passport = require('passport');

router.post('/signup', signup);
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

module.exports = router;
