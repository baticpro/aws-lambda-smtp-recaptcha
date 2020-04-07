const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const reCapUrl = process.env.CAPTCHA_URL;
const reCaptchaSecret = process.env.CAPTCHA_SECRET;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'on',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  let message = `<h2>${process.env.MAIL_HEADER}</h2>`;
  let reCaptchaResponse = null;

  Object.keys(body).forEach(key => {
    if (key === 'token') {
      reCaptchaResponse = body[key];
      return;
    }

    message += `<p><strong>${key}</strong>: ${body[key]}</p>`;
  });

  console.log(reCaptchaResponse);

  const verifyResult = await axios.post(
    `${reCapUrl}?secret=${reCaptchaSecret}&response=${reCaptchaResponse}`,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
    },
  );

  console.log(verifyResult);
  if (verifyResult.data.success === true) {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: process.env.MAIL_SUBJECT,
      html: message
    });

    console.log(info);

    return {
      statusCode: 200,
      body: 'success',
    };
  }

  return {
    statusCode: 500,
    body: 'something wrong',
  };
};
