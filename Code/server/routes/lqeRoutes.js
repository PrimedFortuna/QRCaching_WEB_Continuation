const express = require('express');
const router = express.Router();
const Lqe = require('../models/lqe');
const sanitize = require('mongo-sanitize');

// Create a new lqe
router.post('/', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const newLqe = new Lqe(sanitizedBody);
        const savedLqe = await newLqe.save();
        res.status(201).json(savedLqe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all lqes
router.get('/', async (req, res) => {
    try {
        const lqes = await Lqe.find();
        res.json(lqes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single lqe
router.get('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const lqe = await Lqe.findById(sanitizedId);
        if (!lqe) {
            return res.status(404).json({ message: 'Lqe not found' });
        }
        res.json(lqe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a lqe
router.patch('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const sanitizedBody = sanitize(req.body);
        const lqe = await Lqe.findById(sanitizedId);
        if (!lqe) {
            return res.status(404).json({ message: 'Lqe not found' });
        }

        Object.assign(lqe, sanitizedBody);
        const updatedLqe = await lqe.save();
        res.json(updatedLqe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a lqe
router.delete('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const lqe = await Lqe.findById(sanitizedId);
        if (!lqe) {
            return res.status(404).json({ message: 'Lqe not found' });
        }
        await lqe.deleteOne();
        res.json({ message: 'Lqe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
