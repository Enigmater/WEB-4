const db = require('../config/db'); // Подключаем базу данных

// Контроллер для получения проектов
const getProjects = async (req, res) => {
  try {
    // Выполняем запрос к базе данных для получения всех проектов
    const result = await db.query('SELECT * FROM projects');
    
    // Если проектов нет в базе
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No projects found' });
    }

    // Возвращаем найденные проекты
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

const getProjectsByIds = async (req, res) => {
  const { projIds } = req.body; // Получаем массив proj_id из тела запроса

  if (!Array.isArray(projIds) || projIds.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty projIds array' }); // Проверка на корректность данных
  }

  try {
    // Используем параметризированный запрос, чтобы избежать SQL-инъекций
    const query = `
      SELECT * FROM projects
      WHERE id = ANY($1)`;
    
    // Выполняем запрос с массивом projIds
    const result = await db.query(query, [projIds]);

    // Если проектов нет с такими id
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No projects found with the given ids' });
    }

    // Возвращаем найденные проекты
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects by ids:', error);
    res.status(500).json({ message: 'Failed to fetch projects by ids' });
  }
};

module.exports = {
  getProjects, getProjectsByIds
};