const API = "http://localhost:5000/api/orders";

const getHeaders = (token) => ({ Authorization: `Bearer ${token}` });

// Get user order history
export const getOrderHistory = async (token) => {
  const res = await fetch(API, { headers: getHeaders(token) });
  return res.json();
};
