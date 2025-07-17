# Image to Thumbnail Converter

## Preconditions
- Node.js installed on your machine.
- Run `npm install` to install the required packages.

## Usage

### Dev mode
- Run `npm run dev` to start the development server.
### Production mode
- Run `npm run build` to build the project.
- Run `npm start` to start the production server.

## Features
- App has `/zip` endpoint to upload a zip file containing images.
- It accepts both 'form-data' and 'binary' content types.
- To use 'form-data', use the key `zipFile` to upload the zip file.
### CURL Example
Using form-data:
```
curl --location 'http://localhost:3000/zip' \
--form 'zipFile=@"/Path/to/your/zip/file/test.zip"'
```
Using binary:
```
curl --location 'http://localhost:3000/zip' \
-header 'Content-Type: application/zip' \
--data-binary "@/Path/to/your/zip/file/test.zip"
```