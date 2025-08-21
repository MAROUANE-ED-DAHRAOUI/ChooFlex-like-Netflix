const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET /api/users
router.get('/', usersController.list);

// GET /api/users/:id
router.get('/:id', usersController.get);

// PUT /api/users/:id
router.put('/:id', usersController.update);

// DELETE /api/users/:id
router.delete('/:id', usersController.remove);

// POST /api/users/:id/ban
router.post('/:id/ban', usersController.ban);

// POST /api/users/:id/unban
router.post('/:id/unban', usersController.unban);

module.exports = router;
