const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/userController');

// Маршрут для регистрации нового пользователя
router.post('/register', registerUser);

// Маршрут для логина пользователя
router.post('/login', loginUser);

// Маршрут для получения всех пользователей
router.get('/', getUsers);

module.exports = router;