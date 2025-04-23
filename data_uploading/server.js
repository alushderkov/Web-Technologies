const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const svgCaptcha = require('svg-captcha');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs'); // Шаблонизатор EJS
app.set('views', './views');

// Страница формы с капчей
app.get('/', (req, res) => {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.render('form', { captcha: captcha.data, error: null });
});

// Обработка формы
app.post('/send', async (req, res) => {
  const { email, message, captcha } = req.body;

  if (captcha !== req.session.captcha) {
    return res.render('form', {
      captcha: svgCaptcha.create().data,
      error: 'Неверная капча!',
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: 'noreply@example.com',
    to: email,
    subject: 'Message from form with CAPTCHA',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Письмо отправлено успешно!');
  } catch (error) {
    res.send('Ошибка при отправке: ' + error.message);
  }
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
