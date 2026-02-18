import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import BooksList from './pages/BooksList';
import Login from './pages/Login';
import CartPage from './pages/CartPage';
import OrderHistoryPage from "./pages/OrderHistoryPage";
import HomePage from './pages/HomePage';
import BookDetails from './pages/BookDetails';
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

function App() {
  return (
    <Router>
      {/* Wrap everything in a fragment or div */}
      <>
        {/* Header appears on all pages */}
        <Header />
        
        {/* Main content area with routes */}
        <main className="main-content">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/books" element={<BooksList />} />
            {/* Add more routes as needed */}
             <Route path="/login" element={<Login />} />
               <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                        <Route path="/" element={<HomePage />} /> 
                         <Route path="/books/:id" element={<BookDetails />} />
                            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* Footer appears on all pages */}
        <Footer />
      </>
    </Router>
  );
}

export default App;