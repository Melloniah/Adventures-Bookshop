// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// class ApiClient {
//   constructor() {
//     this.baseURL = API_BASE_URL;
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   }

//   // Products API
//   products = {
//     getAll: (params = {}) => {
//       const queryParams = new URLSearchParams(params).toString();
//       return this.request(`/products?${queryParams}`);
//     },
//     getById: (id) => this.request(`/products/${id}`),
//     getByCategory: (category) => this.request(`/products/category/${category}`),
//     search: (query) => this.request(`/products/search?q=${query}`)
//   };

//   // Categories API
//   categories = {
//     getAll: () => this.request('/categories')
//   };

//   // Orders API
//   orders = {
//     create: (orderData) => this.request('/orders', {
//       method: 'POST',
//       body: JSON.stringify(orderData)
//     }),
//     getById: (id) => this.request(`/orders/${id}`),
//     getUserOrders: (userId) => this.request(`/orders/user/${userId}`)
//   };

//   // M-Pesa API
//   mpesa = {
//     initiateSTKPush: (data) => this.request('/mpesa/stk-push', {
//       method: 'POST',
//       body: JSON.stringify(data)
//     }),
//     checkTransactionStatus: (checkoutRequestId) => 
//       this.request(`/mpesa/transaction-status/${checkoutRequestId}`)
//   };

//   // WhatsApp API
//   whatsapp = {
//     sendOrder: (orderData) => this.request('/whatsapp/send-order', {
//       method: 'POST',
//       body: JSON.stringify(orderData)
//     }),
//     sendMessage: (phoneNumber, message) => this.request('/whatsapp/send-message', {
//       method: 'POST',
//       body: JSON.stringify({ phone_number: phoneNumber, message })
//     })
//   };
// }

// export default new ApiClient();
 

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refresh: () => api.post('/auth/refresh'),
};

export const paymentAPI = {
  initiateMpesa: (data) => api.post('/payments/mpesa', data),
  verifyPayment: (transactionId) => api.get(`/payments/verify/${transactionId}`),
};