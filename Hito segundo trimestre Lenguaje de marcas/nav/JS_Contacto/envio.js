const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/contacto', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nestormaximo.aceveshuelamo.23@campusfp.es',
            pass: 'Nmah062005_'
        }
    });

    const mailOptions = {
        from: email,
        to: 'nestormaximo.aceveshuelamo.23@campusfp.es',
        subject: `Mensaje de ${nombre}`,
        text: mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email enviado: ' + info.response);
            res.send('success');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado...');
});