### unzip-file

The `unzip-file` script is used to extract the contents of a compressed `.zip` file. It takes a zip file `ICONS.zip` as input and decompresses its contents into a specified output directory `icons`, which contains icon images. Before unzipping, we check that the file is not empty using `validateZipFile` function to avoid errors and gracefully show errors to the user.

#### Features:
- Supports standard `.zip` file formats.
- Extracts all files and directories contained within the zip archive.
- Handles nested directory structures within the zip file.
- Provides error handling for invalid or corrupted zip files.

#### Example Usage:
```bash
    node file-system/unzip-file.js
```

### file operations
The `file` script demonstrates basic file operations using Node.js. It includes writing to a file, reading from it, appending data, renaming the file, and deleting it. 

#### Example Usage:
```bash
    node file-system/file.js
```