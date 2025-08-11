const router = require('express').Router();
const Movies = require('../models/Movie');
const verifyToken = require('../middleware/verifyToken');

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

/**
 * @route   GET /find/:id
 * @desc    Get user information by ID (protected)
 * @access  Protected (JWT required)
 */
// Get user information by ID (GET /find/:id)
router.get('/find/:id', verifyToken, async (req, res) => {
    try {
        // Find user by ID and select specific fields
        const user = await User.findById(req.params.id)
            .select('username profilePicture bio createdAt');

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send user data
        res.status(200).json(user);

    } catch (err) {
        // Handle errors
        console.error("Error finding user:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET MY PROFILE (Current logged-in user)
router.get('/me', verifyToken, async (req, res) => {
    try {
        // Find user by ID and exclude password
        const user = await User.findById(req.user.userId).select('-password');
        
        // If user not found, return error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send user profile data
        res.status(200).json({
            message: "Profile retrieved successfully",
            user: user
        });
    } catch (err) {
        // Handle errors
        console.error("Error getting profile:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all users (GET /)
router.get('/', verifyToken, async (req, res) => {
    const query = req.query.new;
    // Only admin can get all users
    if(req.user.isAdmin) {
        try {
            // If query.new is true, get latest 10 users
            const users = query 
                ? await User.find().select('-password').sort({ _id: -1 }).limit(10) 
                : await User.find().select('-password');
            // Send users data
            res.status(200).json(users);
        } catch (err) {
            // Handle errors
            console.error("Error fetching users:", err);
            res.status(500).json({ error: err.message });
        }
    } else {
        // Non-admin users cannot access all users
        res.status(403).json({ error: "You are not allowed to see all users" });
    }
});

//GET USER STATS
router.get("/stats", verifyToken, async (req, res) => {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        try{
            const stats = await User.aggregate([
                { $match: { createdAt: { $gte: lastYear } } },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: 1 }
                    }
                }
            ]);
            res.status(200).json({ stats, months });
        } catch (err) {
            // console.error("Error fetching user stats:", err);
            res.status(500).json({ error: err.message });
        }
});

module.exports = router;
