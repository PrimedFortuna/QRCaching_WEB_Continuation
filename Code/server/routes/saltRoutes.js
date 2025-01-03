const express = require('express');
const router = express.Router();
const Salt = require('../models/salt');

// Create a new salt
router.post('/', async (req, res) => {
    try {
        const newSalt = new Salt(req.body);
        const savedSalt = await newSalt.save();
        res.status(201).json(savedSalt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all salts
router.get('/', async (req, res) => {
    try {
        const salts = await Salt.find();
        res.json(salts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single salt
router.get('/:id', getSalt, (req, res) => {
    res.json(res.salt);
});

// Update a salt
router.patch('/:id', getSalt, async (req, res) => {
    try {
        // Update salt fields as needed
        const updatedSalt = await res.salt.save();
        res.json(updatedSalt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a salt
router.delete('/:id', getSalt, async (req, res) => {
    try {
        await res.salt.remove();
        res.json({ message: 'Salt deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function getSalt(req, res, next) {
    let salt;
    try {
        salt = await Salt.findById(req.params.id);
        if (salt == null) {
            return res.status(404).json({ message: 'Salt not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.salt = salt;
    next();
}

module.exports = router;