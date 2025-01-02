const mongoose = require('mongoose');
const { events } = require('./achievement');

const eventSchema = new mongoose.Schema({
    events_id: { type: Number, required: true },
    events_name: { type: String, required: true },
    events_photo: { type: String, required: true },
    events_map: { type: String, required: true },
    events_svg: { type: String, required: true },
    events_num_qrcodes: { type: Number, default: 0 },
    events_latitude: { type: Number, default: 0 },
    events_longitude: { type: Number, default: 0 },
    events_idate: Date,
    events_fdate: Date,
    events_confirmed: { type: Boolean, default: false },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
