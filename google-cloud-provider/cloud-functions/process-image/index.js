require('dotenv').config(); // Load environment variables

const express = require('express');
const { Storage } = require('@google-cloud/storage');
const nodemailer = require('nodemailer');
const storage = new Storage();

const app = express();
app.use(express.json());

app.post('/', processImage); // Cloud Run default route

// Optionally, also expose /processImage
app.post('/processImage', processImage);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

async function processImage(req, res) {
   const { fileName, base64Image, user } = req.body;
   
    if (!fileName || !base64Image) {
        return res.status(400).send('File name and base64 image data are required.');
    }

    try {
        // Decode the base64 image
        const imageBuffer = Buffer.from(base64Image, 'base64');

        console.log(`Processing image: ${fileName} (${imageBuffer.length} bytes)`);

        // Upload the processed image to Cloud Storage
        const processedFileName = `processed/${fileName}`;
        await uploadBufferToBucket(imageBuffer, processedFileName);

        // send email notification
        if (user && user.email) {
            console.log(`Sending email to ${user.email}`);
            const subject = 'Image Processing Completed';
            const message = `Dear ${user.full_name}, <br/> 
                <p>Your image ${fileName} has been processed successfully.</p>
                <p>You can download it from the following link: 
                <a href="http://localhost:4443/download/storage/v1/b/media_assets/o/${processedFileName}?alt=media">Download Image</a></p>
                <p>Best regards,</p>`;
            await sendEmailNotification(user.email, subject, message);
        }

        res.send(`Image ${fileName} processed and saved as ${processedFileName}.`);
    } catch (error) {
        console.error(`Error processing image: ${error.message}`);
        res.status(500).send('Error processing image.');
    }
};

async function uploadBufferToBucket(buffer, bucketPath) {
    console.log(`Uploading buffer to path ${bucketPath}`);
    const bucket = storage.bucket('media_assets');
    const file = bucket.file(bucketPath);
    const options = {
        resumable: false,
        metadata: {
            contentType: 'application/octet-stream',
        },
    };
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('The provided buffer is not a valid Buffer instance.');
    }
    await file.save(buffer, options);
    console.log(`Buffer uploaded to ${bucketPath}`);
    return file;
};

async function sendEmailNotification(email, subject, message) {
    console.log(`Sending email ${process.env.NODEMAILER_PASSWORD}`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vcarrin87@gmail.com',
            // in local env we can se dotenv to load the password
            // in production we should use --set-env flag to set the password during deployment
            pass: process.env.NODEMAILER_PASSWORD 
        },
    });

    const mailOptions = {
        from: 'vcarrin87@gmail.com',
        to: email,
        subject: subject,
        html: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
}