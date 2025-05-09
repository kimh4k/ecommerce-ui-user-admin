import { createServer } from "http";
import { storage } from "./storage.js";

// Mock data for frontend development
const categories = [
  {
    id: 1,
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
  },
  {
    id: 2,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
  },
  {
    id: 3,
    name: "Home & Decor",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
  },
  {
    id: 4,
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
  },
  {
    id: 5,
    name: "Sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
  },
  {
    id: 6,
    name: "Books",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
  }
];

const products = [
  {
    id: 1,
    name: "Minimalist Sneakers",
    brand: "Urban Outfitters",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    badge: "New",
    rating: 4.5,
    reviews: 28,
    description: "Comfortable minimalist sneakers with premium materials for everyday wear.",
    category: 1,
    inStock: true,
    colors: [
      { value: "White", hex: "#FFFFFF" },
      { value: "Black", hex: "#000000" },
      { value: "Gray", hex: "#808080" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    featured: true
  },
  // ... rest of the products array ...
];

export async function registerRoutes(app) {
  // API routes for the frontend
  
  // Get all categories
  app.get('/api/categories', (req, res) => {
    res.json(categories);
  });
  
  // Get featured products
  app.get('/api/products/featured', (req, res) => {
    const featuredProducts = products.filter(product => product.featured);
    res.json(featuredProducts);
  });
  
  // Get products with filtering
  app.get('/api/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const min = parseInt(req.query.min) || 0;
    const max = parseInt(req.query.max) || 100000;
    const rating = parseInt(req.query.rating) || 0;
    const search = req.query.search;
    const sort = req.query.sort;
    
    // Filter products
    let filteredProducts = [...products];
    
    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category.toString() === category);
    }
    
    // Price range filter
    filteredProducts = filteredProducts.filter(product => 
      product.price >= min && product.price <= max
    );
    
    // Rating filter
    if (rating > 0) {
      filteredProducts = filteredProducts.filter(product => product.rating >= rating);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort products
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Since we don't have dates, we'll sort by ID in descending order
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sort by featured first, then by ID
        filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.id - b.id;
        });
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    });
  });
  
  // Get single product
  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id.toString() === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });
  
  // Create HTTP server
  const server = createServer(app);
  return server;
} 