const express = require('express');
const router = express.Router();
const Achievements = require('../models/achievement');
const sanitize = require('mongo-sanitize');

router.post('/', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const newAchievement = new Achievements(sanitizedBody);
        const savedAchievement = await newAchievement.save();
        res.status(201).json(savedAchievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const achievements = await Achievements.find();
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const achievement = await Achievements.findById(sanitizedId);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const sanitizedBody = sanitize(req.body);
        const achievement = await Achievements.findById(sanitizedId);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        Object.assign(achievement, sanitizedBody);
        const updatedAchievement = await achievement.save();
        res.json(updatedAchievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const achievement = await Achievements.findById(sanitizedId);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        await achievement.remove();
        res.json({ message: 'Achievement deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
