const jwt = require('jsonwebtoken');
const db = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка получения пользователей')
    }
};

// Функция для регистрации нового пользователя
const registerUser = async (req, res) => {
    const { firstname, lastname, email, phone, login, password } = req.body;

    if (!firstname || !lastname || !email || !phone || !login || !password) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    try {
        // Проверка, существует ли уже пользователь с таким логином
        const result = await db.query('SELECT * FROM users WHERE login = $1', [login]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Этот логин уже занят' });
        }

        // Добавляем пользователя в базу данных
        const insertQuery = `
            INSERT INTO users (firstname, lastname, email, phone, login, password)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_user, firstname, lastname, email, phone, login
        `;
        const values = [firstname, lastname, email, phone, login, hashedPassword];
        const insertResult = await db.query(insertQuery, values);

        // Возвращаем данные пользователя без пароля
        const newUser = insertResult.rows[0];
        res.status(201).json(newUser);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
    }
};

// Функция для логина пользователя
const loginUser = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Пожалуйста, введите логин и пароль' });
    }

    try {
        // Получаем пользователя по логину
        const result = await db.query('SELECT * FROM users WHERE login = $1', [login]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Неверный логин или пароль' });
        }

        const user = result.rows[0];

        // Сравниваем введённый пароль с хешированным паролем из базы данных
        const isPasswordValid = await password == user.password;

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Неверный логин или пароль' });
        }

        // Убираем пароль из результата
        const { password: _, ...userWithoutPassword } = user;  
        const { id, login: userLogin } = userWithoutPassword;  // Извлекаем id и login

        // Генерация JWT токена
        const token = jwt.sign(
            { id, login: userLogin }, // Payload
            process.env.JWT_SECRET_KEY, // Секретный ключ (создайте этот ключ в переменных окружения)
            { expiresIn: '1h' } // Время жизни токена
        );

        // Отправляем токен и данные пользователя
        res.status(200).json({ token, user: { id: user.id_user, login: userLogin } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при логине' });
    }
};

module.exports = {
    getUsers,
    registerUser,
    loginUser
};