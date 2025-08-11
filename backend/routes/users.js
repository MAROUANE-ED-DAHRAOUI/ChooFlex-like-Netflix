const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/verifyToken');

/**
 * @route   PUT /:id
 * @desc    Update user information (only self or admin)
 * @access  Protected (JWT required)
 */
// Update user information (PUT /:id)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow user to update their own account or admin
        if (req.user.userId !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ error: "You can only update your account" });
        }

        // Fields that cannot be updated
        const forbiddenFields = ['isAdmin', '_id', 'createdAt', 'updatedAt'];
        const updates = Object.keys(req.body);
        // Check if any forbidden field is being updated
        const hasForbiddenField = updates.some(field => forbiddenFields.includes(field));
        
        if (hasForbiddenField) {
            return res.status(400).json({ error: "Cannot update restricted fields" });
        }

        // If password is being updated, hash it before saving
        if (req.body.password) {
            const saltRounds = 12;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        // Update user document in database
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        // If user not found, return error
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Exclude password from response
        const { password, ...userData } = updatedUser.toObject();
        
        // Send success response with updated user data
        res.status(200).json({
            message: "User updated successfully",
            user: userData
        });
    } catch (err) {
        // Handle errors
        console.error("Error updating user:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /:id
 * @desc    Delete user account (only self or admin)
 * @access  Protected (JWT required)
 */
// Delete user account (DELETE /:id)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow user to delete their own account or admin
        if (req.user.userId !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ error: "You can only delete your account" });
        }

        // Delete user from database
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        // If user not found, return error
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send success response
        res.status(200).json({ message: "User deleted successfully" });

    } catch (err) {
        // Handle errors
        console.error("Error deleting user:", err);
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
