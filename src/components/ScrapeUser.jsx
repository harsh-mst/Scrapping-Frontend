import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ScrapeUser.css";
import VerificationModal from "./VerificationModal";

const ScrapeUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();

  const handleScrape = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        // `http://localhost:5000/api/v1/scrape`,
        // `https://cotyledonous-lenny-overslavish.ngrok-free.dev/api/v1/scrape`,
        `https://sherly-precisive-anjelica.ngrok-free.dev/api/v1/scrape`,
        // `http://34.131.115.252/api/v1/scrape`,
        // `https://scrapping-backend-ykua.onrender.com/api/v1/scrape`,
        { email, password },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      console.log('Full response:', response);

      // Check for verification required (statusCode 202) - Check this BEFORE success check
      // The backend might send success: false but with statusCode 202 for verification
      if ((response.data.statusCode === 202 && response.data.data?.verificationRequired) || 
          response.status === 202) {
        console.log('Verification required (detected in main flow), showing modal...');
        setLoading(false);
        setShowVerification(true);
        return;
      }

      if (response.data.success) {
        // Based on "Available data: statusCode, data, message, success"
        // The actual user data is nested inside response.data.data
        const userData = response.data.data || {};
        const postsScraped = userData.postsScraped || response.data.postsScraped || 0;
        
        setSuccess(`Successfully scraped ${postsScraped} posts`);
        
        console.log('Scrape response:', response.data);
        
        // Try all possible paths for username
        const scrapedUsername = 
          userData.username || 
          userData.user?.username || 
          response.data.username;

        console.log('Found username:', scrapedUsername);

        setTimeout(() => {
          // Redirect to feed
          if (scrapedUsername) {
            navigate(`/feed/${scrapedUsername}`);
          } else {
            setSuccess("Scraping complete. Please check your feed.");
          }
        }, 2000);
      } else {
        // Handle case where success is false but not verification (e.g. wrong password)
        setError(response.data.message || "Failed to scrape. Please check your credentials.");
      }
    } catch (err) {
      console.error('Scrape error:', err);
      
      // Check if the error response contains verification requirement
      // Backend might return 400/401/403 but with verification data
      if (err.response && 
          (err.response.status === 202 || 
           err.response.data?.statusCode === 202 ||
           err.response.data?.data?.verificationRequired)) {
        console.log('Verification required (detected in catch block), showing modal...');
        setLoading(false);
        setShowVerification(true);
        return;
      }

      if (err.response) {
        // Server responded with an error
        setError(err.response.data?.message || "Failed to scrape. Please try again.");
      } else if (err.request) {
        // Request made but no response (server down, network issue)
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      if (!showVerification) {
        setLoading(false);
      }
    }
  };

  const handleVerificationSuccess = (userData) => {
    setShowVerification(false);
    const postsScraped = userData.postsScraped || 0;
    setSuccess(`Successfully scraped ${postsScraped} posts`);
    
    const scrapedUsername = userData.username;
    
    setTimeout(() => {
      if (scrapedUsername) {
        navigate(`/feed/${scrapedUsername}`);
      } else {
        setSuccess("Scraping complete. Please check your feed.");
      }
    }, 2000);
  };

  const handleVerificationCancel = () => {
    setShowVerification(false);
    setError("Verification cancelled. Please try again.");
  };

  return (
    <div className="scrape-container">
      <div className="scrape-card">
        <h2>Scrape LinkedIn Posts</h2>
        <p className="scrape-description">
          Enter your LinkedIn credentials to scrape recent posts
        </p>

        <form onSubmit={handleScrape} className="scrape-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="username-input"
            />
          </div>
          
          <div className="input-group">
             <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="username-input"
            />
          </div>

          <button type="submit" disabled={loading} className="scrape-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                Scraping...
              </>
            ) : (
              "Scrape Posts"
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        {loading && (
          <div className="scraping-info">
            <p>⏳ This may take 30-60 seconds...</p>
            <p className="small-text">We're logging in and collecting posts</p>
          </div>
        )}
      </div>

      {showVerification && (
        <VerificationModal
          email={email}
          password={password}
          onSuccess={handleVerificationSuccess}
          onCancel={handleVerificationCancel}
        />
      )}
    </div>
  );
};

export default ScrapeUser;
