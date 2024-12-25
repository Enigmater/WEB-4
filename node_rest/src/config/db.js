const { Pool } = require('pg');

// Настройка пула подключений
const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'web4',
  user: 'postgres',
  password: 'postgres',
  max: 20, // Максимальное количество подключений
  idleTimeoutMillis: 30000, // Время бездействия перед завершением соединения
  connectionTimeoutMillis: 2000 // Время ожидания при подключении
});


// Подключаемся к базе данных
pool.connect()
  .then(() => {
    console.log('Подключение к базе данных успешно!');
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
  });

// Экспортируем клиент для использования в других частях приложения
module.exports = pool;