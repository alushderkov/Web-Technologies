require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Настройка базы данных
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Настройка Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Отправка писем всем пользователям
async function sendEmails() {
  try {
    const [rows] = await db.query('SELECT email FROM users');

    for (const user of rows) {
      await transporter.sendMail({
        from: '"My Server" <server@example.com>',
        to: user.email,
        subject: 'Привет!',
        text: 'Это тестовое сообщение от сервера',
      });
      console.log(`Отправлено: ${user.email}`);
    }
  } catch (err) {
    console.error('Ошибка при отправке писем:', err);
  }
}

// Отправка по запросу
app.get('/send-emails', async (req, res) => {
  await sendEmails();
  res.send('Письма отправлены!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  sendEmails();
});
