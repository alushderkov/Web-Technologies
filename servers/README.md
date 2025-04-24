# Servers

This folder contains examples of simple HTTP servers built with Node.js, demonstrating various concepts and techniques for handling web requests.

## Server Examples

### app_01.js
- Basic HTTP server listening on port 3500
- Responds with "1" to all requests
- Demonstrates minimal server setup

### app_02.js
- Server on port 3700 with separate request processor function
- Shows how to:
  - Access request URL and method
  - Set response headers (Content-Type)
  - Write HTML content to response
  - Handle UTF-8 encoding

### app_03.js
- Server on port 3000 with route handling
- Uses switch statement to handle different URLs:
  - `/` - Main page
  - `/contact` - Contact page
  - Default - 404 page

### app4.js
- Enhanced version of app_03.js
- Reads HTML content from file for `/contact` route
- Demonstrates file system operations with `fs` module
- Uses `path` module for cross-platform file paths

### app5.js
- More advanced file handling
- Serves static images from `/images` path
- Sets appropriate Content-Type for images
- Demonstrates async file reading
- Basic error handling

### app6.js
- Complete static file server
- Supports multiple MIME types (HTML, JS, CSS, images, fonts, etc.)
- Uses `mimeTypes` mapping object
- Implements reusable `staticFile` function
- Handles file extensions dynamically
- Proper error handling with status codes

## How to Use

1. Clone this repository
2. Install Node.js if not already installed
3. Run any server file with: `node filename.js`
4. Access the server at `http://localhost:[port]` (port varies by file)

## Key Concepts Demonstrated

- HTTP server creation with Node.js core `http` module
- Request/response handling
- Route management
- Static file serving
- Content-Type headers
- File system operations
- Error handling
- MIME type management

## Development Notes

All servers are educational examples meant to demonstrate core concepts. For production use, consider:

- Using frameworks like Express.js
- Implementing more robust error handling
- Adding security measures
- Implementing proper logging
- Adding performance optimizations

Contributions and improvements are welcome!
