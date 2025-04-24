# RESTful API Project

This project implements a simple RESTful API for managing products using Node.js and core HTTP modules. The API follows REST conventions and provides endpoints for product operations.

## Project Structure

```
rest/
├── controllers/
│   └── productController.js  # Handles product-related routes
├── data/
│   └── products.json         # JSON data store for products
├── models/
│   └── productModel.js       # Data access layer for products
├── getPostData.js            # Helper for parsing POST data
├── WriteDataToFile.js        # Helper for writing to files
├── server.js                 # Main server file
├── package.json
└── package-lock.json
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product by ID
- `POST /api/products` - Create a new product

## Key Features

1. **Core Functionality**:
   - RESTful design with proper HTTP methods
   - JSON data storage and retrieval
   - Route handling with parameter support

2. **Helper Modules**:
   - `getPostData.js`: Handles incoming POST request data
   - `WriteDataToFile.js`: Manages file system operations

3. **Error Handling**:
   - 404 for unknown routes
   - 400 for invalid JSON data
   - 500 for server errors

## Getting Started

### Installation

1. Ensure Node.js is installed
2. Clone the repository
3. Navigate to the project directory
4. Install dependencies:

```bash
npm install
```

### Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server runs on port 5500 by default.

## Example Usage

Get all products:
```bash
curl http://localhost:5500/api/products
```

Create new product:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "type": "electronics",
  "title": "Smartphone",
  "desc": "Latest model",
  "color": "black",
  "price": 699.99
}' http://localhost:5500/api/products
```

## Dependencies

- **uuid**: For generating unique product IDs
- **nodemon**: Development dependency for auto-restart

## Code Organization

The project uses a clear separation of concerns:

- `server.js`: Main server configuration and routing
- `productController.js`: Business logic and request handling
- `productModel.js`: Data access and storage operations
- Helper files in root for common utilities

## Extension Points

This basic implementation could be extended with:
- Additional CRUD operations (PUT, DELETE)
- Database integration
- Authentication
- Enhanced error handling
- Request validation

Note: All utility files (`getPostData.js`, `WriteDataToFile.js`) are placed directly in the project root for simplicity.
