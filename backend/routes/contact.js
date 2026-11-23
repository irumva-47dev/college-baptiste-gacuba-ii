const express = require('express');
const { getDatabase } = require('../config/database');

const router = express.Router();
const recipient = 'collegebaptistegacuba2@gmail.com';

router.post('/', async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string'
    ? req.body.email.trim()
    : '';
  const subject = typeof req.body.subject === 'string'
    ? req.body.subject.trim()
    : '';
  const message = typeof req.body.message === 'string'
    ? req.body.message.trim()
    : '';

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      message: 'Amazina, imeyili, umutwe n’ubutumwa birakenewe.'
    });
  }

  if (
    name.length > 150 ||
    email.length > 254 ||
    subject.length > 200 ||
    message.length > 5000 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      message: 'Reba neza amakuru wanditse, wongere ugerageze.'
    });
  }

  try {
    await getDatabase().collection('contact_messages').insertOne({
      name,
      email,
      subject,
      message,
      created_at: new Date()
    });

    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASS;

    if (smtpUser && smtpPassword && [465, 587].includes(smtpPort)) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPassword }
        });

        await transporter.sendMail({
          from: smtpUser,
          to: recipient,
          replyTo: email,
          subject: `Ubutumwa bushya bw’urubuga: ${subject}`,
          text: `Amazina: ${name}\nImeyili: ${email}\n\nUbutumwa:\n${message}`
        });
      } catch (error) {
        console.error('Contact email notification error:', error);
      }
    }

    return res.status(200).json({
      message: 'Ubutumwa bwabitswe neza.'
    });
  } catch (error) {
    console.error('Contact message save error:', error);
    return res.status(500).json({
      message: 'Ubutumwa ntibwabitswe. Ongera ugerageze.'
    });
  }
});

module.exports = router;
