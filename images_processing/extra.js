const express = require('express');
const useragent = require('useragent');
const app = express();
const port = 3000;

// Хранилище статистики
const browserStats = {};

app.use((req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const browser = `${agent.family}`;

  browserStats[browser] = (browserStats[browser] || 0) + 1;
  next();
});

// Главная страница — вывод статистики
app.get('/', (req, res) => {
  const sortedStats = Object.entries(browserStats)
    .sort((a, b) => b[1] - a[1]);

  let tableRows = sortedStats.map(([browser, count]) =>
    `<tr><td>${browser}</td><td>${count}</td></tr>`).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Статистика по браузерам</title>
      <style>
        table { border-collapse: collapse; width: 50%; margin: 20px auto; }
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h2 style="text-align:center;">Статистика по браузерам</h2>
      <table>
        <tr><th>Браузер</th><th>Количество пользователей</th></tr>
        ${tableRows}
      </table>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
