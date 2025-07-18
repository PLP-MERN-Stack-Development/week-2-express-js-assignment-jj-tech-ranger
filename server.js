// ====================================================================
// =================== Task 1: Express.js Setup =======================
// ====================================================================
const express = require('express');
const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');

// ====================================================================
// ================== Task 4: Error Handling ==========================
// ====================================================================
// --- Custom Error Classes ---
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

// ====================================================================
// ================ Task 3: Middleware Implementation =================
// ====================================================================
// --- Middleware to parse JSON request bodies ---
app.use(express.json());

// --- Custom Logger Middleware ---
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};
app.use(loggerMiddleware);

// --- Authentication Middleware ---
const authenticateMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const requiredApiKey = 'mysecretapikey'; // For demonstration purposes
  if (!apiKey || apiKey !== requiredApiKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
  next();
};

// --- Validation Middleware ---
const validateProductMiddleware = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || typeof name !== 'string') {
    return next(new ValidationError('Name must be a non-empty string.'));
  }
  if (!price || typeof price !== 'number' || price <= 0) {
    return next(new ValidationError('Price must be a positive number.'));
  }
  next();
};

// ====================================================================
// =================== Task 2: RESTful API Routes =====================
// ====================================================================
// --- In-memory array to act as a simple database ---
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'Powerful laptop for all your needs.',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Coffee Mug',
    description: 'A large ceramic mug.',
    price: 15,
    category: 'home goods',
    inStock: false
  },
  {
    id: '3',
    name: 'Smartphone',
    description: 'Latest model with advanced features.',
    price: 800,
    category: 'electronics',
    inStock: true
  }
];

// --- "Hello World" route ---
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ====================================================================
// =================== Task 5: Advanced Features ======================
// ====================================================================
// --- Filtering and Pagination on GET all products ---
app.get('/api/products', (req, res) => {
  const { category, page, limit } = req.query;
  let filteredProducts = products;

  // Apply filtering
  if (category) {
    filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Apply pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json(paginatedProducts);
});

// --- Search endpoint by name ---
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: 'Search query parameter "q" is required.' });
  }

  const searchTerm = q.toLowerCase();
  const searchResults = products.filter(p => p.name.toLowerCase().includes(searchTerm));

  res.json(searchResults);
});

// --- Product statistics endpoint ---
app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, currentProduct) => {
    const category = currentProduct.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  res.json(stats);
});

// --- GET a specific product by ID ---
app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found.'));
  }
  res.json(product);
});

// --- POST a new product ---
app.post('/api/products', authenticateMiddleware, validateProductMiddleware, (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// --- PUT update an existing product ---
app.put('/api/products/:id', authenticateMiddleware, validateProductMiddleware, (req, res, next) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return next(new NotFoundError('Product not found.'));
  }
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: req.params.id,
  };
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// --- DELETE a product ---
app.delete('/api/products/:id', authenticateMiddleware, (req, res, next) => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === initialLength) {
    return next(new NotFoundError('Product not found.'));
  }
  res.status(204).send();
});

// ====================================================================
// === Global Error Handling Middleware ================
// ====================================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';

  res.status(status).json({
    error: {
      message: message,
      status: status
    }
  });
});

// ====================================================================
// ========================= Start Server =============================
// ====================================================================
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});