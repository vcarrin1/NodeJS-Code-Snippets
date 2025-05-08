const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

exports.processImage = async (req, res) => {
   const { fileName, base64Image } = req.body;
   
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