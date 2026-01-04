import React, { useState } from "react";
import axios from "axios";
import "./VerificationModal.css";

const VerificationModal = ({ email, password, onSuccess, onCancel }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Submitting verification code:', { email, code: otp });
      
      const response = await axios.post(
        // `http://localhost:5000/api/v1/submit-verification`,
        // `https://scrapping-backend-i9hu.onrender.com/api/v1/submit-verification`,
        `https://scrapping-backend-ykua.onrender.com/api/v1/submit-verification`,
        {
          email,
          password,
          code: otp,
        }
      );

      console.log('Verification response:', response.data);

      if (response.data.success) {
        const userData = response.data.data || {};
        onSuccess(userData);
      } else {
        // Backend returned success: false
        setError(response.data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error('Verification error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response) {
        setError(
          err.response.data?.message ||
            "Invalid verification code. Please try again."
        );
      } else if (err.request) {
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🔒 Security Verification Required</h2>
          <p className="modal-description">
            LinkedIn has sent a verification code to your email. Please enter it
            below to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="input-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              className="otp-input"
              maxLength="6"
              autoFocus
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                "Submit Code"
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="verification-info">
            <p>⏳ Verifying code and resuming scraping...</p>
            <p className="small-text">This may take a moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationModal;
