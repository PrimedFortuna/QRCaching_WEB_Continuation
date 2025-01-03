const express = require('express');
const router = express.Router();
const Salt = require('../models/salt');


router.delete('/:id', getSalt, async (req, res) => {
    try {
        await res.salt.deleteOne();
        res.json({ message: 'Salt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const salts = await Salt.find();
        res.json(salts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



async function getSalt(req, res, next) {
    try {
        // Fetch the salt using the provided user_id
        const salt = await Salt.findById(req.params.id);
        if (salt == null) {
            return res.status(404).json({ error: 'Salt not found' });
        }
    } catch (error) {
        return next(new Error(`Error retrieving salt: ${error.message}`)); // Pass the error to the error handler
    }
}


module.exports = router;