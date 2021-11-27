const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config').JWT_SECRET;
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');

// Route: Create user
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
        let user = await User.findOne({ name });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        let totalUsers = await User.find().countDocuments();
        if (totalUsers >= 1) {
            return res.status(400).json({ msg: 'Only one user is allowed' });
        }

        user = new User({
            name,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route: Login user
router.post('/login', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Please enter a password').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
        let user = await User.findOne({ name });

        if (!user) {
            return res.status(404).json({ msg: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route: Get user
router.get('/', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Unauthenticated route: Check if at least one user exists
router.get('/check', async (req, res) => {
    try {
        const user = await User.findOne();
        if (user) {
            res.json({ userExists: true });
        } else {
            res.json({ userExists: false });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route: Change password
router.post('/change-password', fetchUser, [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id).select('+password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;