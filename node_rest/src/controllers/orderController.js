const db = require('../config/db'); // Подключаем базу данных

// Контроллер для получения заказов
const getOrders = async (req, res) => {
  try {
    const {userId} = req.query; // Получаем логин пользователя из заголовков
    if (!userId) {
        return res.status(400).json({ message: 'User id is required' });
    }

    // Выполняем запрос к базе данных, чтобы получить все заказы
    const result = await db.query('SELECT * FROM "order" o JOIN projects p on o.id_proj = p.proj_id where id_user = $1', [userId]);
    
    // Если заказов нет, возвращаем пустой массив
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No orders found' });
    }

    // Возвращаем найденные заказы
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Контроллер для создания нового заказа
const createOrder = async (req, res) => {
  const { login, project_id } = req.body;

  // Проверяем, что все необходимые данные предоставлены
  if (!login || !project_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Создаем запрос для вставки нового заказа
    const query = `
      INSERT INTO "order" (id_user, id_proj, date)
      VALUES ((select id_user from users where login = $1), $2, NOW())
      RETURNING *;`;

    // Выполняем запрос и получаем результат
    const result = await db.query(query, [login, project_id]);

    // Возвращаем созданный заказ в ответе
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId, userId} = req.query;  // Получаем id заказа из параметров URL
  //const { userId } = req.query;    // Получаем id пользователя из query параметров

  if (!orderId || !userId) {
    return res.status(400).json({ message: 'Order id and user id are required' });
  }

  try {
    // Проверка, что заказ принадлежит этому пользователю
    const orderResult = await db.query('SELECT * FROM "order" WHERE id_order = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];
    
    // Проверяем, что заказ принадлежит пользователю с указанным id
    if (order.id_user !== parseInt(userId)) {
      return res.status(403).json({ message: 'You cannot delete this order' });
    }

    // Удаляем заказ
    await db.query('DELETE FROM "order" WHERE id_order = $1', [orderId]);

    // Возвращаем успешный ответ
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
}

module.exports = { getOrders, createOrder, deleteOrder };