import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

if (process.env.NODE_ENV !== "production") {
  console.log('API_URL:', API_URL);
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ensures HttpOnly cookie is sent
});

api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// AUTH
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// PRODUCTS
export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }), // accepts { page, limit, category, search, on_sale, is_featured }
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getProductsOnSale: (params = {}) => api.get('/products', { params: { ...params, on_sale: true } }),
  getProductsFeatured: (params = {}) => api.get('/products', { params: { ...params, is_featured: true } }),
};

// CATEGORIES
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
};

// ORDERS
export const orderAPI = {
  customerAddAOrder: (data) => api.post('/orders', data),
  customerTrackOrder: (email, orderNumber) =>
    api.get('/orders/track', { params: { email, order_number: orderNumber } }),
};

// DELIVERY ROUTES
export const deliveryAPI = {
  getAllRoutes: () => api.get('/delivery/routes'),
  // Get route by ID (includes stops)
  getRouteById: (routeId) => api.get(`/delivery/routes/${routeId}`),
  // Search stops by name (for autocomplete)
  searchStops: (name) => api.get(`/delivery/stops/${encodeURIComponent(name)}`),
};

// PAYMENTS
export const paymentAPI = {
  initiateMpesa: (data) => api.post('/payments/mpesa', data),
  verifyPayment: (transactionId) => api.get(`/payments/verify/${transactionId}`),
  sendWhatsappOrder: (orderId) => api.get(`/payments/whatsapp?order_id=${orderId}`),
};

// ADMIN
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  

  // PRODUCTS------
  getAllProducts: (page = 1, limit = 20) =>
  api.get('/admin/products', { params: { page, limit } }),

  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getProductById: (id) => api.get(`/admin/products/${id}`),

  searchProducts: (query, page = 1, limit = 20) =>
  api.get('/admin/products/search', { params: { q: query, page, limit } }),

  uploadImage: (formData) => api.post('/admin/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // --- HERO BANNERS ---
  getHeroBanners: () => api.get('/admin/hero-banners'),
  createHeroBanner: (formData) => api.post('/admin/hero-banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateHeroBanner: (id, formData) => api.put(`/admin/hero-banners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteHeroBanner: (id) => api.delete(`/admin/hero-banners/${id}`),
  
  getAllOrders: () => api.get('/admin/orders'),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),

  // --- ADMIN DELIVERY ROUTES ---
getAllDeliveryRoutes: () => api.get('/admin/delivery-routes'),
getDeliveryRouteById: (id) => api.get(`/admin/delivery-routes/${id}`),
createDeliveryRoute: (data) => api.post('/admin/delivery-routes', data),
updateDeliveryRoute: (id, data) => api.put(`/admin/delivery-routes/${id}`, data),
deleteDeliveryRoute: (id) => api.delete(`/admin/delivery-routes/${id}`),

};

// PUBLIC HERO BANNERS
export const getPublicHeroBannersAPI = {
  getPublicHeroBanners: () => api.get('/hero-banners'),
};
