const formData = require('form-data');
const Mailgun = require('mailgun.js');
require("dotenv").config();
const mailgun = new Mailgun(formData);

const { MAILGUN_API_KEY, MAILGUN_DOMAIN  } = process.env;


const sendEmail = async (data) => {
    const mg = mailgun.client({ username: 'karinatkachenko44@gmail.com', key: MAILGUN_API_KEY  });
    const email = { ...data, from: "Excited User <karinatkachenko44@gmail.com>", }
    await mg.messages.create(MAILGUN_DOMAIN , email);
    return true;
}


module.exports = sendEmail;