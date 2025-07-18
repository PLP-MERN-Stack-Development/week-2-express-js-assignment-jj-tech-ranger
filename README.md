# Week 2: Express.js – Server-Side Framework

### **Assignment Overview**

This project is a RESTful API built with Express.js that implements standard CRUD operations for a `products` resource. It includes proper routing, middleware for logging, authentication, and validation, as well as comprehensive error handling and advanced features like filtering, pagination, and searching.

### **Getting Started**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-jj-tech-ranger](https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-jj-tech-ranger)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd week-2-express-js-assignment-jj-tech-ranger
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

### **API Endpoints Documentation**

The API exposes the following endpoints for managing products.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve a list of all products. Supports filtering by `category` and pagination with `page` and `limit` query parameters. |
| `GET` | `/api/products/search?q=[query]` | Search for products by name. Requires a `q` query parameter. |
| `GET` | `/api/products/stats` | Get statistics on products (e.g., count by category). |
| `GET` | `/api/products/:id` | Retrieve a single product by its unique ID. |
| `POST` | `/api/products` | Create a new product. Requires a valid `X-API-Key` header and a JSON body. |
| `PUT` | `/api/products/:id` | Update an existing product by its ID. Requires a valid `X-API-Key` header and a JSON body. |
| `DELETE` | `/api/products/:id` | Delete a product by its ID. Requires a valid `X-API-Key` header. |

### **API Usage Examples**

Here are some example requests and expected responses using Postman or `curl`.

**1. Create a New Product (`POST /api/products`)**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/products`
- **Headers:** `X-API-Key: mysecretapikey`
- **Body (JSON):**
  ```json
  {
    "name": "Headphones",
    "description": "Noise-cancelling over-ear headphones.",
    "price": 250,
    "category": "electronics",
    "inStock": true
  }
