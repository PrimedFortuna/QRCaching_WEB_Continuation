const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const lqrcodeRoutes = require('./routes/lqrcodeRoutes');
const postRoutes = require('./routes/postRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const saltRoutes = require('./routes/saltRoutes');
const ulqRoutes = require('./routes/ulqRoutes');
const lqeRoutes = require('./routes/lqeRoutes');
const achlqeRoutes = require('./routes/achlqeRoutes');

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../site')));


mongoose.connect('mongodb://mongo1:27017/myDatabase', {})
    .then(() => {
        console.log('Connected to MongoDB');

        app.use('/users', userRoutes);
        app.use('/events', eventRoutes);
        app.use('/lqrcodes', lqrcodeRoutes);
        app.use('/posts', postRoutes); 
        app.use('/achievements', achievementRoutes);
        app.use('/salts', saltRoutes);
        app.use('/ulqs', ulqRoutes);
        app.use('/lqes', lqeRoutes);
        app.use('/achlqes', achlqeRoutes);

        const PORT = process.env.PORT || 80;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });