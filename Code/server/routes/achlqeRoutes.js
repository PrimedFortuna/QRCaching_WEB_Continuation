const express = require('express');
const router = express.Router();
const Achlqe = require('../models/achlqe');
const sanitize = require('mongo-sanitize');

router.post('/', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const newAchlqe = new Achlqe(sanitizedBody);
        const savedAchlqe = await newAchlqe.save();
        res.status(201).json(savedAchlqe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const achlqes = await Achlqe.find();
        res.json(achlqes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const achlqe = await Achlqe.findById(sanitizedId);
        if (!achlqe) {
            return res.status(404).json({ message: 'Achlqe not found' });
        }
        res.json(achlqe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const sanitizedBody = sanitize(req.body);
        const achlqe = await Achlqe.findById(sanitizedId);
        if (!achlqe) {
            return res.status(404).json({ message: 'Achlqe not found' });
        }
        Object.assign(achlqe, sanitizedBody);
        const updatedAchlqe = await achlqe.save();
        res.json(updatedAchlqe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const achlqe = await Achlqe.findById(sanitizedId);
        if (!achlqe) {
            return res.status(404).json({ message: 'Achlqe not found' });
        }
        await achlqe.remove();
        res.json({ message: 'Achlqe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
