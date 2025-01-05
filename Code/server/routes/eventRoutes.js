const express = require('express');
const router = express.Router();
const { DOMParser } = require('xmldom');
const Lqrcode = require('../models/lqrcode'); 
const Lqe = require('../models/lqe'); 
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
        const eventId = sanitizedBody.id;

        // Fetch the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const svgContent = event.events_svg;
        if (!svgContent) {
            return res.status(400).json({ message: 'SVG content is missing in the event.' });
        }

        // Parse the SVG content using xmldom
        const domParser = new DOMParser();
        const svgDoc = domParser.parseFromString(svgContent, 'text/xml');
        const rects = svgDoc.getElementsByTagName('rect');

        const blackDots = [];
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            const style = rect.getAttribute('style');
            if (style && style.includes('fill:#000000')) {
                const x = parseFloat(rect.getAttribute('x'));
                const y = parseFloat(rect.getAttribute('y'));
                if (!isNaN(x) && !isNaN(y)) {
                    blackDots.push({ x, y });
                }
            }
        }

        if (blackDots.length === 0) {
            return res.status(400).json({ message: 'No black dots found in the SVG.' });
        }

        for (const { x, y } of blackDots) {
            const newQrCode = new Lqrcode({
                lqrcode_longitude: x,
                lqrcode_latitude: y,
                lqrcode_altitude: null,
                lqrcode_is_event: true,
                lqrcode_is_quest: null,
                lqrcode_times_scanned: 0,
            });

            const savedQrCode = await newQrCode.save();

            const newLqe = new Lqe({
                lqe_lqrcode_id: savedQrCode._id,
                lqe_events_id: eventId,
            });

            await newLqe.save();
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
