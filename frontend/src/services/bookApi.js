export const getBookById = (id) => {
  return fetch(`http://localhost:5000/api/books/${id}`);
};

export const addReview = (bookId, review, token) => {
  return fetch(`http://localhost:5000/api/reviews/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });
};
