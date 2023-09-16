const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const express = require('express');
const http = require('http');
const app = express();
let buffer;

// Function to generate a captcha image
async function generateCaptcha() {
    const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lengthOtp = 6;
    let captcha = "";

    for (let i = 0; i < lengthOtp; i++) {
        const index = Math.floor(Math.random() * charsArray.length);
        captcha += charsArray[index];
    }

    const canvas = createCanvas(150, 50);
    const ctx = canvas.getContext("2d");

    // Fill the canvas with a white background
    ctx.fillStyle = '#FFFFFF'; // White color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "25px Georgia";
    ctx.fillStyle = '#000000'; // Black color for the text
    ctx.fillText(captcha, 10, 30);

    // Convert the canvas to a Buffer containing the image data
    buffer = canvas.toBuffer('image/png');

    // Return the image data buffer and captcha text
    return { buffer, captcha };
}

// Create an HTTP server
const port = 5001; // Replace with your desired port number

// Define a route to handle requests for the captcha image and HTML response
app.get('/captcha', async (req, res) => {
    try {
        const { buffer, captcha } = await generateCaptcha();
        console.log(captcha);
        //const { share1buffer } = await encrypt()
        
        // Create an HTML page with the image and a download button
        const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Encryption</title>
          <style>
          /* Center the button using Flexbox */
          body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 500vh; /* Make sure the body covers the entire viewport height */
              margin: 10px; /* Remove default margin */
          }
  
          /* Style for the download button */
          #downloadButton {
              background-color: #007BFF; /* Set the background color */
              color: #FFFFFF; /* Set the text color */
              padding: 10px 20px; /* Add padding */
              border: none; /* Remove the border */
              border-radius: 10px; /* Add rounded corners */
              cursor: pointer; /* Change cursor on hover */
          }
  
          /* Style for the download link (hidden by default) */
          #share1DownloadLink {
              display: none;
          }
      </style>
        </head>
        <body>
          <canvas id = "canvas1"></canvas>
          <canvas id = "canvas2"></canvas>
          
          <p>Download Captcha:</p>
          <a id="share1DownloadLink" style="display: none;"></a>
          <!-- Button to trigger the download link -->
    <button id="downloadButton">Share-1 Image</button>
          <canvas id = "canvas3"></canvas>
          
        
          <script>
          const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');


//making ctx
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');


//initializing all the widhts and height.
canvas1.width = canvas1.height = canvas2.width = canvas2.height = canvas3.width = canvas3.height = 512;

//creating new images
const image1 = new Image();


//loading the original image.
image1.src = "data:image/png;base64,${buffer.toString('base64')}";


// Generate a random number between 0 (inclusive) and 1 (exclusive)
const randomValue = Math.random();

// Generate a random integer between min (inclusive) and max (inclusive)
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


image1.addEventListener('load', function(){
    //ctx1.drawImage(image1, 0, 0, canvas1.width, canvas1.height);
    //ctx.drawImage(image2, 0, 0, canvas.width, canvas.height);

    const share1Image = ctx2.getImageData(0,0,canvas2.width, canvas2.height);
    const share2Image = ctx3.getImageData(0,0,canvas3.width, canvas3.height);
    const scannedImage = ctx1.getImageData(0,0,canvas1.width, canvas1.height);
    //console.log(scannedImage);
    const scannedData = scannedImage.data;
    const share1Data = share1Image.data;
    const share2Data = share2Image.data;
  

    //creation of share-1
    for(let i=0; i<share1Data.length; i+=4){
        share1Data[i] = getRandomInteger(0,255);
        share1Data[i+1] = getRandomInteger(0,255);
        share1Data[i+2] = getRandomInteger(0,255);
        share1Data[i+3] = 255;
    }
    share1Image.data = share1Data;
    ctx2.putImageData(share1Image, 0, 0);

    canvas2.toBlob(function(blob) {
        // Create an object URL for the Blob
        const objectURL = URL.createObjectURL(blob);

        // Get the anchor tag by id
        const downloadLink = document.getElementById('share1DownloadLink');

        // Set anchor tag properties
        downloadLink.href = objectURL;
        downloadLink.download = 'share1.png'; // Set the filename for download
        //downloadLink.textContent = 'Download Share-1 Image';
        //downloadLink.style.display = 'block'; // Show the anchor tag

        alert("Badal barsa .... share - 1 aaya !");
        console.log(share1Image);
    }, 'image/png');
    //share - 1 is generated

    alert("Badal barsa .... share - 1 aaya !");
    console.log(share1Image);

   
    //creation of share-2
    for (let i=0; i<share2Data.length; i+=4){
        share2Data[i] = scannedData[i] ^ share1Data[i];
        share2Data[i+1] = scannedData[i+1] ^ share1Data[i+1];
        share2Data[i+2] = scannedData[i+2] ^ share1Data[i+2];
        share2Data[i+3] = 255;
    }
    
    //share2Image.data = share2Data;
    //ctx3.putImageData(share2Image, 0, 0);

    //alert("Badal barsa .....share - 2 !");
    //console.log(share2Image);
})

const downloadButton = document.getElementById('downloadButton');
const share1DownloadLink = document.getElementById('share1DownloadLink');

// Add a click event listener to the button
downloadButton.addEventListener('click', function() {
    // Simulate a click on the download link
    share1DownloadLink.click();
});

          </script>
        </body>
        </html>
        `;
        
        res.send(htmlResponse);
    } catch (error) {
        console.error(error);
        res.status(500).end('Internal Server Error');
    }
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).end('Not Found');
});

// Start the Express.js server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


const obj = {
    buffer: buffer,
}
module.exports = {obj};
