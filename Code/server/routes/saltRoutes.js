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




async function getSalt(user_id) {
    try {
        // Fetch the salt using the provided user_id
        const salt = await Salt.findById(req.params.id);

        if (!salt) {
            throw new Error('Salt not found for this user');
        }

        return salt.salt; // Return the salt value
    } catch (error) {
        throw new Error(`Error retrieving salt: ${error.message}`);
    }
}

module.exports = router;