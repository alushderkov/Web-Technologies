const mysql = require('mysql2/promise');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Настройки подключения к MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '18072006', // Замени на свой!
  database: 'cities_game'
};

// Функция для определения последней буквы (исключая "ь", "ы", "й")
function getLastLetter(city) {
  const lastChar = city.slice(-1).toLowerCase();
  const badLetters = ['ь', 'ы', 'й'];
  return badLetters.includes(lastChar) ? city.slice(-2, -1).toLowerCase() : lastChar;
}

// Основной игровой цикл
async function playGame() {
  const connection = await mysql.createConnection(dbConfig);

  console.log('Игра началась! Назови город:');
  askPlayer(connection);
}

async function askPlayer(connection) {
  readline.question('> ', async (playerCity) => {
    // Проверяем, есть ли город в БД и не использован ли он
    const [rows] = await connection.query(
      'SELECT * FROM cities WHERE name = ? AND used = FALSE',
      [playerCity]
    );

    if (rows.length === 0) {
      console.log('Город не найден или уже использован! Ты проиграл.');
      await connection.end();
      process.exit();
    }

    // Помечаем город как использованный
    await connection.query(
      'UPDATE cities SET used = TRUE WHERE name = ?',
      [playerCity]
    );

    // Ход компьютера (с вероятностью 97.4%)
    if (Math.random() < 0.026) {
      console.log('Компьютер не смог найти город. Ты победил!');
      await connection.end();
      process.exit();
    }

    // Ищем город на последнюю букву
    const lastLetter = getLastLetter(playerCity);
    const [computerCities] = await connection.query(
      'SELECT * FROM cities WHERE name LIKE ? AND used = FALSE LIMIT 1',
      [`${lastLetter}%`]
    );

    if (computerCities.length === 0) {
      console.log('Компьютер не нашёл город. Ты победил!');
      await connection.end();
      process.exit();
    }

    const computerCity = computerCities[0].name;
    await connection.query(
      'UPDATE cities SET used = TRUE WHERE name = ?',
      [computerCity]
    );

    console.log(`Компьютер: ${computerCity}`);
    askPlayer(connection); // Следующий ход
  });
}

// Запуск игры
playGame();