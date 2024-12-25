// routes/projectRoutes.js
const express = require('express');
const router = express.Router();

// Импортируем контроллер, который экспортирует функцию getProjects
const projectController = require('../controllers/projectController');

// Маршрут для получения списка проектов
router.get('/', projectController.getProjects);
router.post('/ids', projectController.getProjectsByIds);

module.exports = router;