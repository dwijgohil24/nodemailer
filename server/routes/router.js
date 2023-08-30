
/*
const express = require('express');
const nodemailer = require('nodemailer');
const router = new express.Router();

// Function to generate random captcha image
function generateCaptcha() {
    const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lengthOtp = 6;
    let captcha = "";

    for (let i = 0; i < lengthOtp; i++) {
        const index = Math.floor(Math.random() * charsArray.length);
        captcha += charsArray[index];
    }

    const canvas = document.createElement("canvas");
    canvas.width = 150; // Change this to desired width
    canvas.height = 50; // Change this to desired height
    const ctx = canvas.getContext("2d");
    ctx.font = "25px Georgia";
    ctx.fillText(captcha, 10, 30);

    // Convert the canvas to a data URL
    return canvas.toDataURL("image/png");
}

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        // Generate random captcha image and save it temporarily on the server
        const captchaDataURL = generateCaptcha();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Replace with your Gmail email address
                pass: process.env.PASSWORD // Replace with your Gmail app password or account password
            }
        });

        const mailOption = {
            from: process.env.EMAIL, // Replace with your Gmail email address
            to: email,
            subject: 'Captcha and Job Offer',
            html: `
                <h1>Congratulations! You've received a job offer.</h1>
                <p>Please find the attached captcha image below:</p>
                <img src="cid:captchaImage">
                <p>You can also download the captcha image from this link: <a href="${captchaDataURL}" target="_blank" download="captcha.png">Download Captcha</a></p>
            `,
            attachments: [
                {
                    filename: 'captcha.png',
                    content: captchaDataURL.split(',')[1], // Extract base64 content
                    cid: 'captchaImage'
                }
            ]
        };

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log('Error', error);
                res.status(500).json({ error });
            } else {
                console.log('Email sent', info.response);
                res.status(201).json({
                    status: 201,
                    info
                });
            }
        });
    } catch (error) {
        res.status(401).json({
            status: 401,
            error
        });
    }
});

module.exports = router;

*/



const express = require('express')
const nodemailer = require("nodemailer")
const router = new express.Router()

router.post("/register" , (req , res) => {
    const {email} = req.body;
    
    try {

        //const captchaDataURL = generateCaptcha();
        const transporter = nodemailer.createTransport({
            service : "gmail",
            auth: {
                user : process.env.EMAIL,
                pass : process.env.PASSWORD
            }
        })

        const mailOption = {
            from : process.env.EMAIL,
            to : email,
            subject : "Authentication successfuly done ",
            html : `
            <h1>Congratulations! You've received an email.</h1>
                <p>Please find the message </p>
               `
         
        }
     
        transporter.sendMail(mailOption , (error , info) => {
            if(error) console.log("Error" , error)
            else {
               console.log("Email sent" + info.response)
               res.status(201).json({
                status : 201,
                info
               })

           }
        })
    }
    catch(error)
    {
        res.status(401).json({
            status : 401,
            error
           })
    }
})


module.exports = router

