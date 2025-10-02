import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('API_URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials:true,
});

api.interceptors.request.use((config) => {
  // Only set Content-Type for non-FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Don't add Authorization header - let cookies handle auth
  // The HttpOnly cookie will be sent automatically with withCredentials: true

  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'), 
};


// API endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products`, { params: { category } }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),

   // NEW: fetch products on sale
  getProductsOnSale: () => api.get('/products', { params: { on_sale: true } }),

  // optional: fetch featured products
  getProductsFeatured: () => api.get('/products', { params: { is_featured: true } }),

};

export const categoryAPI={
   getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
}

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};


export const paymentAPI = {
  initiateMpesa: (data) => api.post('/payments/mpesa', data),
  verifyPayment: (transactionId) => api.get(`/payments/verify/${transactionId}`),
};


export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Orders
  getAllOrders: () => api.get('/admin/orders'),

  // Products CRUD
   getAllProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getProductById: (id) => api.get(`/admin/products/${id}`),
  searchProducts: (query) => api.get('/admin/products/search', { params: { q: query } }), //fetches products from api

  // Image upload
  uploadImage: (formData) =>
    api.post('/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),


  // Hero banners
   // Admin Hero banners (protected)
  getHeroBanners: () => api.get('/admin/hero-banners'),
  createHeroBanner: (formData) =>
    api.post('/admin/hero-banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateHeroBanner: (id, formData) =>
    api.put(`/admin/hero-banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteHeroBanner: (id) => api.delete(`/admin/hero-banners/${id}`),

};

 // Public Hero banners (frontend display, no token needed)
 export const getPublicHeroBannersAPI={
  getPublicHeroBanners: () => api.get('/hero-banners'),}