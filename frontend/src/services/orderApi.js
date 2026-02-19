import API_URL from '../config';

const API = `${API_URL}/api/orders`;

const getHeaders = (token) => ({ Authorization: `Bearer ${token}` });

// Get user order history
export const getOrderHistory = async (token) => {
  const res = await fetch(API, { headers: getHeaders(token) });
  return res.json();
};