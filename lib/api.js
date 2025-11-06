import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

if (process.env.NODE_ENV !== "production") {
  console.log('API_URL:', API_URL);
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getProductsOnSale: (params = {}) => api.get('/products', { params: { ...params, on_sale: true } }),
  getProductsFeatured: (params = {}) => api.get('/products', { params: { ...params, is_featured: true } }),
};

// CATEGORIES (Public)
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryTree: () => api.get('/categories/tree'),
  getParentCategories: () => api.get('/categories/parents'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  getSubcategories: (id) => api.get(`/categories/${id}/subcategories`),
  getCategoryProducts: (id, params = {}) => api.get(`/categories/${id}/products`, { params }),
  getCategoryProductsBySlug: (slug, params = {}) => api.get(`/categories/slug/${slug}/products`, { params }),

getCategoryHierarchy:()=> api.get(`/categories/tree`,),
  getAllCategoryProductsRecursive: (id) => api.get(`/categories/${id}/all-products`),
  getCategoryBreadcrumbs: (id) => api.get(`/categories/${id}/breadcrumbs`),
  getCategoryBreadcrumbs: (slug) => api.get( `/categories/slug/${slug}/breadcrumbs`),
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
  getRouteById: (routeId) => api.get(`/delivery/routes/${routeId}`),
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
  // DASHBOARD
  getDashboardStats: () => api.get("/admin/dashboard"),

  // PRODUCTS
getAllProducts: (page = 1, limit = 20) =>
  api.get("/admin/products", { params: { page, limit } }),

createProduct: (data) =>
  api.post(`/admin/products`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

updateProduct: (id, data) =>
  api.patch(`/admin/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

deleteProduct: (id) => api.delete(`/admin/products/${id}`),

getProductById: (id) => api.get(`/admin/products/${id}`),

searchProducts: (query, page = 1, limit = 20) =>
  api.get("/admin/products/search", { params: { q: query, page, limit } }),

uploadImage: (formData) =>
  api.post("/admin/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),


  // HERO BANNERS
  getHeroBanners: () => api.get("/admin/hero-banners"),
  createHeroBanner: (formData) =>
    api.post("/admin/hero-banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateHeroBanner: (id, formData) =>
    api.put(`/admin/hero-banners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteHeroBanner: (id) => api.delete(`/admin/hero-banners/${id}`),

  // ORDERS
  getAllOrders: (page = 1, limit = 20, status = null, search = null) => {
    const params = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    return api.get("/admin/orders", { params });
  },
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),

  // DELIVERY ROUTES
  getAllDeliveryRoutes: ({ page = 1, limit = 20 } = {}) =>
    api.get("/admin/delivery-routes", { params: { page, limit } }),
  getDeliveryRouteById: (id) => api.get(`/admin/delivery-routes/${id}`),
  createDeliveryRoute: (data) => api.post("/admin/delivery-routes", data),
  updateDeliveryRoute: (id, data) => api.put(`/admin/delivery-routes/${id}`, data),
  deleteDeliveryRoute: (id) => api.delete(`/admin/delivery-routes/${id}`),

  // CATEGORIES (Admin - Full CRUD)
  getAdminCategories: ({ skip = 0, limit = 20, include_inactive = false } = {}) =>
    api.get("/admin/categories", { params: { skip, limit, include_inactive } }),

  getCategoryTree: () => api.get("/admin/categories/tree"),

  getParentCategories: () => api.get("/admin/categories/parents"),

  getAdminCategoryById: (id) => api.get(`/admin/categories/${id}`),

  searchAdminCategories: ({ q, skip = 0, limit = 10 }) =>
    api.get("/admin/categories/search", { params: { q, skip, limit } }),

  createCategory: (formData) =>
    api.post("/admin/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateCategory: (id, formData) =>
    api.patch(`/admin/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  getCategoryProducts: (categoryId, includeSubcategories = false) =>
    api.get(`/admin/categories/${categoryId}/products`, {
      params: { include_subcategory_products: includeSubcategories },
    }),

  // Product category assignment - move product to another category
  // backend expects a form field `new_category_id`
  moveProductToCategory: (productId, newCategoryId) =>
    api.post(
      `/admin/categories/products/${productId}/move`,
      new URLSearchParams({ new_category_id: String(newCategoryId) }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    ),

  // Category stats
  getCategoryStats: () => api.get("/admin/categories/stats"),
};


// PUBLIC HERO BANNERS
export const getPublicHeroBannersAPI = {
  getPublicHeroBanners: () => api.get('/hero-banners'),
};