const fs = require('fs');
const path = require('path');

/**
 * This script demonstrates basic file operations using Node.js.
 * It includes writing to a file, reading from it, appending data,
 * renaming the file, and deleting it. 
 * Usage: node file-system/file.js
 */

// File path where to add the example file
// __dirname is the directory name of the current module
const filePath = path.join(__dirname, 'example.txt');

// Write to file example.txt
fs.writeFile(filePath, 'Hello! This is an example file.', (err) => {
    if (err) {
        return console.error('Error writing to file:', err);
    }
    console.log('File written successfully.');

    // Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return console.error('Error reading file:', err);
        }
        console.log('File content:', data);

        // Append to the file
        fs.appendFile(filePath, '\nAppended text.', (err) => {
            if (err) {
                return console.error('Error appending to file:', err);
            }
            console.log('Text appended successfully.');

            // Rename the file
            const newFilePath = path.join(__dirname, 'renamed-example.txt');
            fs.rename(filePath, newFilePath, (err) => {
                if (err) {
                    return console.error('Error renaming file:', err);
                }
                console.log('File renamed successfully.');

                // Delete the file
                fs.unlink(newFilePath, (err) => {
                    if (err) {
                        return console.error('Error deleting file:', err);
                    }
                    console.log('File deleted successfully.');
                });
            });
        });
    });
});