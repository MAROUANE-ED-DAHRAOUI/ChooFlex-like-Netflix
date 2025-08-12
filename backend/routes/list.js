const router = require('express').Router();
const lists = require('../models/list');
const verifyToken = require('../middleware/verifyToken');

// Create a new list
router.post('/', verifyToken, async (req, res) => {
    try {
        // Only allow admin to create a new list
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "You are not allowed to create a list" });
        }

        // Create a new list document
        const newList = new lists(req.body);
        const savedList = await newList.save();

        // Send success response with created list data
        res.status(201).json({
            message: "List created successfully",
            list: savedList
        });
    } catch (err) {
        // Handle errors
        console.error("Error creating list:", err);
        res.status(500).json({ error: err.message });
    }
});

// delete a list
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow admin to delete a list
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "You are not allowed to delete a list" });
        }

        // Find and delete the list by ID
        const deletedList = await lists.findByIdAndDelete(req.params.id);
        if (!deletedList) {
            return res.status(404).json({ error: "List not found" });
        }

        // Send success response
        res.status(200).json({
            message: "List deleted successfully",
            list: deletedList
        });
    } catch (err) {
        // Handle errors
        console.error("Error deleting list:", err);
        res.status(500).json({ error: err.message });
    }
});


// Get
router.get('/', verifyToken, async (req, res) => {
    const typequery = req.query.type;
    const genrequery = req.query.genre;
    let list = [];

    try {
        if (typequery) {
            if (genrequery) {
                // Get lists by type and genre
                list = await lists.aggregate([
                    { $match: { type: typequery, genre: genrequery } },
                    { $sample: { size: 10 } }
                ]);
            } else {
                // Get lists by type only
                list = await lists.aggregate([
                    { $match: { type: typequery } },
                    { $sample: { size: 10 } }
                ]);
            }
        } else {
            // Get all lists
            list = await lists.aggregate([{ $sample: { size: 10 } }]);
        }

        res.status(200).json(list);
    } catch (err) {
        console.error("Error fetching lists:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
