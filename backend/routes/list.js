const router = require('express').Router();
const lists = require('../models/list');
const verifyToken = require('../middleware/verifyToken');

// Test endpoint for lists (no auth required)
router.get('/test', async (req, res) => {
    try {
        res.status(200).json([
            {
                _id: "list1",
                title: "Trending Now",
                type: "movie",
                genre: "action",
                content: ["test1", "test2"]
            },
            {
                _id: "list2", 
                title: "Popular Series",
                type: "series",
                genre: "drama",
                content: ["test2"]
            },
            {
                _id: "list3",
                title: "Action Movies",
                type: "movie", 
                genre: "action",
                content: ["test1"]
            }
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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


// Get lists - temporarily without auth for testing
router.get('/', async (req, res) => {
    const typequery = req.query.type;
    const genrequery = req.query.genre;
    const populate = req.query.populate === 'true'; // Option to populate content
    let list = [];

    try {
        // First, let's check if we have any lists in the database
        const listCount = await lists.countDocuments();
        console.log(`Total lists in database: ${listCount}`);
        
        if (listCount === 0) {
            // Return mock data if no lists in database
            const mockLists = [
                {
                    _id: "mock1",
                    title: "Trending Now",
                    type: typequery || "movie",
                    genre: genrequery || "action",
                    content: [
                        {
                            _id: "movie1",
                            title: "Sample Movie 1",
                            desc: "A sample movie description",
                            img: "https://via.placeholder.com/300x450/ff6b6b/ffffff?text=Movie+1",
                            imgSm: "https://via.placeholder.com/150x225/ff6b6b/ffffff?text=M1",
                            year: "2024",
                            genre: "Action",
                            isSeries: false
                        },
                        {
                            _id: "movie2", 
                            title: "Sample Movie 2",
                            desc: "Another sample movie description",
                            img: "https://via.placeholder.com/300x450/4ecdc4/ffffff?text=Movie+2",
                            imgSm: "https://via.placeholder.com/150x225/4ecdc4/ffffff?text=M2",
                            year: "2024",
                            genre: "Drama",
                            isSeries: false
                        }
                    ]
                },
                {
                    _id: "mock2",
                    title: "Popular " + (typequery === "series" ? "Series" : "Movies"),
                    type: typequery || "movie",
                    genre: genrequery || "drama",
                    content: [
                        {
                            _id: "content1",
                            title: typequery === "series" ? "Sample Series 1" : "Sample Movie 3",
                            desc: "Another sample content description",
                            img: "https://via.placeholder.com/300x450/45b7d1/ffffff?text=Content+1",
                            imgSm: "https://via.placeholder.com/150x225/45b7d1/ffffff?text=C1",
                            year: "2024", 
                            genre: "Drama",
                            isSeries: typequery === "series"
                        }
                    ]
                }
            ];
            return res.status(200).json(mockLists);
        }

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

        // If populate is requested, populate the content with actual movie data
        if (populate && list.length > 0) {
            const Movie = require('../models/movie');
            
            for (let i = 0; i < list.length; i++) {
                if (list[i].content && Array.isArray(list[i].content)) {
                    const populatedContent = [];
                    
                    for (const movieId of list[i].content) {
                        try {
                            const movie = await Movie.findById(movieId);
                            if (movie) {
                                populatedContent.push(movie);
                            }
                        } catch (error) {
                            console.error(`Error fetching movie ${movieId}:`, error);
                        }
                    }
                    
                    list[i].content = populatedContent;
                }
            }
        }

        res.status(200).json(list);
    } catch (err) {
        console.error("Error fetching lists:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
