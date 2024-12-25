const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
const path = require('path'); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors()); // Разрешаем все кросс-доменные запросы

// Отдача статических файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/userRoutes'); // Импорт маршрутов для пользователей
const orderRoutes = require('./routes/orderRoutes'); // Импорт маршрутов для пользователей
const projectRoutes = require('./routes/projectRoutes'); // Импорт маршрутов для пользователей
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/projects", projectRoutes);

const port = 3001;
app.listen(port, () => {
    console.log("Server is listening on port", port);
});


// Массив с набором имен
const names = ['Yuri', 'Ivan', 'Anna', 'Olga', 'John', 'Alice', 'Eve'];
app.get("/api/name", (req, res) => {
    // Выбираем случайное имя из массива
    const randomName = names[Math.floor(Math.random() * names.length)];

    // Отправляем выбранное имя в ответе
    res.json({ name: randomName });
});