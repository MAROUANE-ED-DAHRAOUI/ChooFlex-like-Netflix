const router = require('express').Router();
const Movies = require('../models/movie');
const verifyToken = require('../middleware/verifyToken');

// Test endpoint for series (no auth required)
router.get('/test', async (req, res) => {
    try {
        res.status(200).json({
            message: "Series API is working",
            series: [
                {
                    _id: "series1",
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

// Get all series (GET /)
router.get('/', verifyToken, async (req, res) => {
    try {
        // Get all series
        const series = await Movies.find({ isSeries: true });
        res.status(200).json(series);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
