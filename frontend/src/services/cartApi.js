const API = "http://localhost:5000/api/cart"; // replace with your backend URL

// Get user cart
export const getCart = async (token) => {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (data.success) return data.items; // return items directly
  throw new Error(data.message || "Failed to fetch cart");
};

// Add to cart
export const addToCart = async (bookId, token) => {
  const res = await fetch(`${API}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ bookId })
  });
  const data = await res.json();
  if (data.success) return data.cartItem; // return added item
  throw new Error(data.message || "Failed to add to cart");
};

// Update quantity
export const updateQuantity = async (bookId, quantity, token) => {
  const res = await fetch(`${API}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ bookId, quantity })
  });
  const data = await res.json();
  if (data.success) return true;
  throw new Error(data.message || "Failed to update quantity");
};

// Remove item
export const removeItem = async (bookId, token) => {
  const res = await fetch(`${API}/remove/${bookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (data.success) return true;
  throw new Error(data.message || "Failed to remove item");
};
