const router = require('express').Router();
const Movies = require('../models/movie');
const verifyToken = require('../middleware/verifyToken');

// Test endpoint for movies (no auth required)
router.get('/test', async (req, res) => {
    try {
        res.status(200).json({
            message: "Movies API is working",
            movies: [
                {
                    _id: "test1",
                    title: "Test Movie 1",
                    desc: "A test movie description",
                    img: "https://via.placeholder.com/300x450",
                    imgTitle: "https://via.placeholder.com/400x200",
                    imgSm: "https://via.placeholder.com/150x225",
                    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    year: "2024",
                    limit: 13,
                    genre: "Action",
                    isSeries: false
                },
                {
                    _id: "test2",
                    title: "Test Series 1",
                    desc: "A test series description",
                    img: "https://via.placeholder.com/300x450",
                    imgTitle: "https://via.placeholder.com/400x200",
                    imgSm: "https://via.placeholder.com/150x225",
                    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    year: "2024",
                    limit: 16,
                    genre: "Drama",
                    isSeries: true
                }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new movie
router.post('/', verifyToken, async (req, res) => {
    try {
        // Only allow admin to create a new movie
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "You are not allowed to create a movie" });
        }

        // Create a new movie document
        const newMovie = new Movies(req.body);
        const savedMovie = await newMovie.save();

        // Send success response with created movie data
        res.status(201).json({
            message: "Movie created successfully",
            movie: savedMovie
        });
    } catch (err) {
        // Handle errors
        console.error("Error creating movie:", err);
        res.status(500).json({ error: err.message });
    }
});


// Update a movie
router.put('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow admin to update a movie
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "You are not allowed to update this movie" });
        }
        // Find movie by ID and update it
        const updatedMovie = await Movies.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body // Ensure req.body is validated before this step
            },
            { new: true } // Return the updated document
        );

        // If movie not found, return error
        if (!updatedMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Send success response with updated movie data
        res.status(200).json({
            message: "Movie updated successfully",
            movie: updatedMovie
        });
    } catch (err) {
        console.error("Error updating movie:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete user account (DELETE /:id)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow admin to delete
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "You are not allowed to delete this movie" });
        }

        // Find movie by ID and delete it
        const deletedMovie = await Movies.findByIdAndDelete(req.params.id);

        // If movie not found, return error
        if (!deletedMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Send success response
        res.status(200).json({
            message: "Movie deleted successfully",
            movie: deletedMovie
        });
    } catch (err) {
        console.error("Error deleting movie:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get Movie by ID (GET /:id)
router.get('/find/:id', verifyToken, async (req, res) => {
    try {
        // Find movie by ID
        const movie = await Movies.findById(req.params.id);
        // If movie not found, return error
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        // Send success response with movie data
        res.status(200).json(movie);
    } catch (err) {
        console.error("Error getting movie:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get Random Movie (GET /random)
router.get('/random', verifyToken, async (req, res) => {
    const type = req.query.type; // Get type from query params
    let movie;
    try {

        if(type === "series") {
            // Get a random series
            movie = await Movies.aggregate([
                { $match: { isSeries: true } }, // Match only series
                { $sample: { size: 1 } } // Randomly select one
            ]);
        }
        else {
            // Get a random movie
            movie = await Movies.aggregate([
                { $match: { isSeries: false } }, // Match only movies
                { $sample: { size: 1 } } // Randomly select one
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        console.error("Error getting random movie:", err);
        res.status(500).json({ error: err.message });
    }
});


// Get all movies (GET /all)
router.get('/all', verifyToken, async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(403).json({ error: "You are not allowed to view all movies" });
    }
    else {
        try {
            // Get all movies
            const movies = await Movies.find();
            res.status(200).json(movies.reverse());
        } catch (err) {
            console.error("Error getting all movies:", err);
            res.status(500).json({ error: err.message });
        }
    }
});

module.exports = router;
