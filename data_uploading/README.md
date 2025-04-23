# Node.js Utilities Collection

This project contains four independent Node.js utilities for various tasks.

## Installation and Launch

1. Clone the repository  
2. Install dependencies:  
  
   ```bash
   npm install
   ```  
3. Run the desired utility:

### 1. Image Download Server

**Purpose**: Downloads all images from a webpage at the specified URL.

**Run**:
```bash
node download_images.js
```

**Usage**: After starting the server, send a POST request to `http://localhost:3000/download-images` with the following parameters:
```json
{
  "url": "page_URL",
  "outputDir": "output_directory"
}
```

### 2. Recursive Image Downloader

**Purpose**: Scans a website to a specified depth and downloads all found images.

**Run**:
```bash
node directed_images_downloading.js website_URL
```

**Settings**: You can change the scan depth and other parameters in the config at the beginning of the file.

### 3. CAPTCHA-Protected Email Server

**Purpose**: Web form with CAPTCHA protection for sending messages via email.

**Run**:
```bash
node server.js
```

**Usage**: Open `http://localhost:3000` in a browser and fill out the form. SMTP settings must be configured in the `.env` file.

### 4. Weather Forecast

**Purpose**: Displays the weather forecast for tomorrow in the specified city in the console.

**Run**:
```bash
node weather.js [city]
```
(defaults to Minsk if no city is provided)

## Important Notes

- Some utilities require a `.env` file with credentials  
- All utilities are fully independent and can be used separately  
- Logs are printed to the console for easier debugging  

Use real website URLs (for image downloaders) or valid email addresses (for the CAPTCHA server) when testing each utility.