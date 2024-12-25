const express = require('express');
const router = express.Router();
const { getOrders, createOrder, deleteOrder } = require('../controllers/orderController'); // Импортируем контроллер

// Маршрут для получения заказов
router.get('/', getOrders);  

// Маршрут для создания заказа
router.post('/create', createOrder)

// Маршрут для удаления заказа
router.delete('/', deleteOrder);

// Экспортируем маршруты
module.exports = router;    