# Working with emails and files

This folder contains a set of independent Node.js utilities for various purposes. Each utility can be used separately.

## Installation

1. Clone the repository  
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your database by running:
   ```bash
   mysql -u root -p < table.sql
   ```

## Utilities

### 1. Email Sender Service (`server.js`)

**Purpose**: Sends emails to all users in the database.

**How to use**:
1. Configure your database and Mailtrap credentials in `.env`
2. Start the server:
   ```bash
   node server.js
   ```
3. Emails will be sent automatically on startup  
4. You can also trigger sending manually by visiting:
   ```
   http://localhost:3000/send-emails
   ```

**Testing**: Check your Mailtrap inbox for test emails.

### 2. Image Processor (`image_processor.js`)

**Purpose**: Generates image previews in multiple formats.

**How to use**:
1. Place your images in an `images` folder  
2. Run the processor:
   ```bash
   node image_processor.js
   ```
3. Previews will be saved in `./image_previews` by default

**Testing**: Add some test images to the `images` folder and verify previews are generated.

### 3. Browser Statistics Tracker (`extra.js`)

**Purpose**: Tracks and displays browser usage statistics.

**How to use**:
1. Start the server:
   ```bash
   node extra.js
   ```
2. Visit in different browsers:
   ```
   http://localhost:3000
   ```
3. View statistics on the main page

**Testing**: Access the page from different browsers to see statistics update.

### 4. Directory Archiver (`archiver.js`)

**Purpose**: Automatically creates ZIP archives of specified directories.

**How to use**:
1. Edit `directoriesToArchive` array in the file to point to your directories  
2. Run the script:
   ```bash
   node archiver.js
   ```
3. Archives will be created in the `archives` folder after 1 minute

**Testing**: Verify archives are created with proper contents.

## Configuration

Create a `.env` file with these variables (example values provided):

```
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

## Quick Start

To test all utilities:

1. Install dependencies and set up database  
2. Start each utility in separate terminal windows:
   ```bash
   node server.js
   node extra.js
   node archiver.js
   ```
3. For image processing, run when needed:
   ```bash
   node image_processor.js
   ```

Each utility will provide console output about its operation status.