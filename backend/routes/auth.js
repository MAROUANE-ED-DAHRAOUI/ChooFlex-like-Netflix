const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateRegister } = require('../middleware/validateRegister'); // Import the validation middleware


// Register with JWT
router.post('/register', validateRegister, async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        
        // Save the user to the database
        const savedUser = await newUser.save();
        
        // GENERATE JWT TOKEN
        const token_access = jwt.sign(
            { userId: savedUser._id, isAdmin: savedUser.isAdmin || false },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Don't return the password in response
        const { password, ...userWithoutPassword } = savedUser.toObject();
        
        res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword,
            token_access: token_access // ADD JWT TOKEN
        });
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ error: err.message });
    }
});

// Login route (you'll need this too)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        // Compare password with hash
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token_access = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );
        
        /**
         * Destructures the user object to remove the password field,
         * returning a new object containing all user properties except the password.
         * This is useful for sending user data in responses without exposing sensitive information.
         */
        const { password, ...userWithoutPassword } = user.toObject();
        
        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token_access: token_access // JWT token for authentication
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
