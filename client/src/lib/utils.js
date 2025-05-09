// clsx and tailwind-merge implementation for cn function
export function cn(...inputs) {
  // Simple implementation that joins the classes with a space
  return inputs.flat().filter(Boolean).join(' ');
}

// Format price with currency symbol
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return null;
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Generate pagination range
export const getPaginationRange = (currentPage, totalPages, maxButtons = 5) => {
  // Calculate the start and end of the pagination range
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;
  
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

// Generate star rating display
export const generateStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars
  };
};

// Filter products by search query
export const filterProductsByQuery = (products, query) => {
  if (!query.trim()) return products;
  
  const lowerCaseQuery = query.toLowerCase().trim();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) ||
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    (product.brand && product.brand.toLowerCase().includes(lowerCaseQuery))
  );
};

// Sort products by different criteria
export const sortProducts = (products, sortBy) => {
  const productsToSort = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return productsToSort.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return productsToSort.sort((a, b) => b.price - a.price);
    case 'rating':
      return productsToSort.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return productsToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'featured':
    default:
      return productsToSort;
  }
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/images')) return `http://localhost:5000${imageUrl}`;
  return `http://localhost:5000/images/products/${imageUrl}`;
};
