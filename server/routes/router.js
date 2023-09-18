const express = require('express')
const nodemailer = require("nodemailer")
const cors = require('cors');
const app = express();
   
app.use(cors());
const router = new express.Router();


router.post("/register" , async(req , res) => {
    const {email} = req.body;

    try {

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
                <a href = "http://localhost:5001/captcha"> Download captcha image here !</a>
               `
         
        }
     
        transporter.sendMail(mailOption , (error , info) => {
            if(error) console.log("Error" , error)
            else {
        
                console.log('Email sent successfully:', info.response);
                // Redirect to the desired location after email is sent
                console.log("redirection tried !");
                res.status(200).json({ redirectUrl: 'http://localhost:5002/image' });

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

