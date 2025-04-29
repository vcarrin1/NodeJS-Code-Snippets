const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

// Function to unzip a file and read its contents
async function unzipAndRead(filePath) {
    const fullPath = path.join(__dirname, filePath);
    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    try {
        // check if zip file is empty or contains icons
        // we cannot unzip an empty file
        const icons = await validateZipFile(fullPath);
        if (icons?.length > 0) { 
            const zipEntries = await extractZip(fullPath, path.join(__dirname, './icons'));
            zipEntries.forEach((entry) => {
                if (!entry.isDirectory) {
                    console.log(`Image name: ${entry.entryName}`);
                }
            });
        } else {
            console.log('No icons found in the zip file.');
        }
    } catch (error) {
        console.error('Error unzipping file:', error);
    }
}

// extract zip file to a directory
// and return all entries from the zip file
async function extractZip(zipPath, extractPath) {
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);
      return zip.getEntries();
    } catch (e) {
      console.error(`Error unzipping file ${zipPath} for ${extractPath}`, e);
    }
  }
  
async function validateZipFile(zipPath) {
    try {
      const zip = new AdmZip(zipPath);
      const zipEntries = zip.getEntries();
      // return all images from zip file
      return zipEntries.map(entry => entry.entryName).sort();
    } catch (e) {
      console.error(`Error checking for zip file ${zipPath}`, e);
      return [];
    }
}

// Example usage
const zipFilePath = './ICONS.zip';


unzipAndRead(zipFilePath);