const express = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Create a transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER || "smtp.gmail.com", // Replace with your SMTP server (e.g., smtp.gmail.com)
    port: process.env.SMTP_PORT, // Use 465 for secure connections
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.SMTP_EMAIL, // Replace with your email
        pass: process.env.SMTP_PASSWORD, // Replace with your email password or app password
    },
});


app.post('/api/sendMail', (req, res) => {
    const { name, email, subject, message } = req.body;
    // console.log(req.body);
    // Email content
    const mailOptions = {
        from: `"Website Contact Form" <${email}>`, // Sender's email
        to: process.env.SMTP_EMAIL, // Replace with the email you want to receive messages at
        subject: `New Contact Form Submission: ${subject}`,
        text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p>You received a new message:</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send({ status: 1, msg: "Message sent", data: req.body });
});

app.listen('8001');



