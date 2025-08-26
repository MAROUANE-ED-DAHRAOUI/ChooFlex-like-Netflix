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

// PUT /api/users/:id/ban
router.put('/:id/ban', usersController.ban);

// PUT /api/users/:id/unban
router.put('/:id/unban', usersController.unban);

module.exports = router;
