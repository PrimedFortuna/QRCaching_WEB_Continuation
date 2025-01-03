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
        console.error('Error creating user:', error);
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

// Get a single user
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Update a user
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.user_name != null) {
        res.user.user_name = req.body.user_name;
    }
    if (req.body.user_phone != null) {
        res.user.user_phone = req.body.user_phone;
    }
    if (req.body.user_bdate != null) {
        res.user.user_bdate = req.body.user_bdate;
    }
    if (req.body.user_password != null) {
        res.user.user_password = req.body.user_password;
    }
    if (req.body.user_email != null) {
        res.user.user_email = req.body.user_email;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        await Salt.deleteOne({ user_id: res.user.user_id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Signup route
router.post('/signup', async (req, res) => {
    try {
        // Find the user with the highest user_id
        const allUsers = await User.find({}, { user_id: 1 }).sort({ user_id: 1 }); // Get all user IDs in ascending order
        let nextUserId = 1; // Default value if no user exists yet

        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].user_id !== i + 1) {
                nextUserId = i + 1;
                break;
            }
        }

        // If no gaps were found, set `nextUserId` to one greater than the last user_id
        if (nextUserId === allUsers.length + 1) {
            nextUserId = allUsers.length + 1;
        }

        const { user_name, user_email, user_password } = req.body;

        //user exists email or name
        let userExists = await User.findOne({ user_name });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        userExists = await User.findOne({ user_email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = crypto.randomBytes(16).toString('hex');

        const hashedPassword = crypto
            .createHmac('sha256', salt)
            .update(user_password)
            .digest('hex');

        const newUser = new User({
            user_id: nextUserId,
            user_name,
            user_email,
            user_password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const newSalt = new Salt({
            user_id: savedUser.user_id,
            salt,
        });

        await newSalt.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ user_email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Retrieve the salt for the user
        const saltEntry = await Salt.findOne({ user_id: user.user_id });
        if (!saltEntry) {
            return res.status(500).json({ message: "Error, User Not Found" });
        }

        const salt = saltEntry.salt;

        // Hash the incoming password with the salt
        const hashedPassword = crypto
            .createHmac('sha256', salt)
            .update(user_password)
            .digest('hex');

        // Compare the hashed passwords
        if (hashedPassword !== user.user_password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // User authenticated successfully
        res.status(200).json({ message: 'Login successful', userId: user._id, userName: user.user_name, userEmail: user.user_email });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: error.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.user = user;
    next();
}

module.exports = router;
