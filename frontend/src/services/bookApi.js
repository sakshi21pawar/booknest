import API_URL from '../config';

export const getBookById = (id) => {
  return fetch(`${API_URL}/api/books/${id}`);
};

export const addReview = (bookId, review, token) => {
  return fetch(`${API_URL}/api/reviews/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });
};