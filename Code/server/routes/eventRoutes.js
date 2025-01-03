const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const sanitize = require('mongo-sanitize');

// Create a new event
router.post('/', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const newEvent = new Event(sanitizedBody);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get the total number of events
router.get('/count', async (req, res) => {
    try {
        const eventCount = await Event.countDocuments();
        res.status(200).json({ eventCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all confirmed events
router.get('/confirmed', async (req, res) => {
    try {
        const events = await Event.find({ events_confirmed: true });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all unconfirmed events
router.get('/unconfirmed', async (req, res) => {
    try {
        const events = await Event.find({ events_confirmed: false });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new event with an automatically assigned ID
router.post('/create_event', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const allEvents = await Event.find({}, { events_id: 1 }).sort({ events_id: 1 });
        let newEventId = 1;

        for (let i = 0; i < allEvents.length; i++) {
            if (allEvents[i].events_id !== i + 1) {
                newEventId = i + 1;
                break;
            }
        }

        if (newEventId === allEvents.length + 1) {
            newEventId = allEvents.length + 1;
        }

        const newEvent = new Event({
            events_id: newEventId,
            ...sanitizedBody,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accept an event
router.post('/accept_event', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const event = await Event.findById(sanitizedBody);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.events_confirmed = true;
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const event = await Event.findById(sanitizedId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an event by ID
router.patch('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const sanitizedBody = sanitize(req.body);
        const event = await Event.findById(sanitizedId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        Object.assign(event, sanitizedBody);
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const event = await Event.findById(sanitizedId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.deleteOne();
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
