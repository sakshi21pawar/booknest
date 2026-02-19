import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchBook = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error("Failed to fetch book:", err);
      setBook(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  const handleAddToCart = () => {
    if (!user) return alert("Please login first!");
    setAddingToCart(true);
    setTimeout(() => {
      alert(`"${book.title}" added to cart!`);
      setAddingToCart(false);
    }, 500);
  };

  const handleSubmitReview = async () => {
    if (!user) return alert("Please login to submit a review.");
    if (!comment.trim()) return alert("Please enter a comment.");
    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/books/${id}/reviews`,
        { rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(5);
      setComment("");
      await fetchBook();
      alert("Review submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (avg) => {
    const fullStars = Math.floor(avg);
    const halfStar = avg % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <span key={`f${i}`} className="star filled">★</span>)}
        {halfStar && <span className="star half">☆</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`e${i}`} className="star empty">☆</span>)}
      </>
    );
  };

  if (loading) return <div className="loading">Loading book details...</div>;
  if (!book)   return <div className="not-found">Book not found.</div>;

  return (
    <div className="book-details-container">
      <div className="book-header">
        <h1>{book.title}</h1>
        <p>by {book.author}</p>
        <div className="average-rating">
          {book.review_count > 0 ? (
            <>
              {renderStars(book.average_rating)}
              <span className="rating-number">{Number(book.average_rating).toFixed(1)} / 5</span>
              <span className="review-count">({book.review_count} review{book.review_count !== 1 ? "s" : ""})</span>
            </>
          ) : (
            <span>No ratings yet</span>
          )}
        </div>
        {user && (
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}>Logout</button>
        )}
      </div>

      <div className="book-main">
        <div className="book-image">
          <img
            src={book.image_url || "https://via.placeholder.com/250x350"}
            alt={book.title}
            onError={(e) => (e.target.src = "https://via.placeholder.com/250x350")}
          />
        </div>
        <div className="book-info">
          <h2>Description</h2>
          <p>{book.description || "No description available."}</p>
          <h3>Details</h3>
          <ul>
            {book.genre     && <li><strong>Genre:</strong> {book.genre}</li>}
            {book.pages     && <li><strong>Pages:</strong> {book.pages}</li>}
            {book.language  && <li><strong>Language:</strong> {book.language}</li>}
            {book.publisher && <li><strong>Publisher:</strong> {book.publisher}</li>}
            {book.category  && <li><strong>Category:</strong> {book.category}</li>}
            {book.stock !== undefined && <li><strong>Stock:</strong> {book.stock}</li>}
          </ul>
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? "Adding to Cart..." : "🛒 Add to Cart"}
          </button>
        </div>
      </div>

      <div className="book-reviews">
        <h2>Customer Reviews</h2>
        {book.reviews && book.reviews.length > 0 ? (
          <ul>
            {book.reviews.map((r) => (
              <li key={r.id}>
                <strong>{r.name || "Anonymous"}</strong>
                <span style={{ float: 'right', color: '#e9b44c' }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <p style={{ margin: '6px 0 0', color: '#95a5a6', fontSize: '0.9rem' }}>{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to share your thoughts!</p>
        )}

        <div className="add-review-form">
          <h3>Write a Review</h3>
          <label>Your Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" className={rating >= star ? "active" : ""} onClick={() => setRating(star)}>★</button>
            ))}
            <span>{rating} star{rating !== 1 ? "s" : ""}</span>
          </div>
          <label>Your Comment</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." rows={4} />
          <button onClick={handleSubmitReview} disabled={submitting || !comment.trim()}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;