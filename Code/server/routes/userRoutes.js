const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/user');
const Salt = require('../models/salt');

// Create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User signup with unique ID, hashed password, and salt storage
router.post('/signup', async (req, res) => {
    try {
        // Find the user with the highest user_id
        const allUsers = await User.find({}, { user_id: 1 }).sort({ user_id: 1 });
        let nextUserId = 1;

        // Logic to assign the next available user_id, considering any gaps
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].user_id !== i + 1) {
                nextUserId = i + 1;
                break;
            }
        }

        // If no gaps, set nextUserId to one greater than the last user_id
        if (nextUserId === allUsers.length + 1) {
            nextUserId = allUsers.length + 1;
        }

        const { user_name, user_email, user_password } = req.body;

        // Check if username or email already exists
        let userExists = await User.findOne({ user_name });
        if (userExists) return res.status(400).json({ message: 'Username already exists' });

        userExists = await User.findOne({ user_email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Generate salt and hash the password using HMAC with SHA-256
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.createHmac('sha256', salt).update(user_password).digest('hex');

        // Create and save the new user
        const newUser = new User({
            user_id: nextUserId,
            user_name,
            user_email,
            user_password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Save the salt associated with the user
        const newSalt = new Salt({ user_id: savedUser.user_id, salt });
        await newSalt.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User login with hashed password comparison
router.post('/login', async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ user_email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Retrieve the salt associated with the user
        const saltEntry = await Salt.findOne({ user_id: user.user_id });
        if (!saltEntry) return res.status(500).json({ message: 'Error, User Not Found' });

        // Hash the incoming password with the user's salt
        const hashedPassword = crypto.createHmac('sha256', saltEntry.salt).update(user_password).digest('hex');

        // Compare the hashed password with the stored password
        if (hashedPassword !== user.user_password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // User authenticated successfully, return user details
        res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            userName: user.user_name,
            userEmail: user.user_email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single user by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Update user details
router.patch('/:id', getUser, async (req, res) => {
    const updatableFields = ['user_name', 'user_phone', 'user_bdate', 'user_password', 'user_email'];
    updatableFields.forEach((field) => {
        if (req.body[field] != null) res.user[field] = req.body[field];
    });

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user and their associated salt
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        await Salt.deleteOne({ user_id: res.user.user_id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to fetch a user by ID
async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = router;
