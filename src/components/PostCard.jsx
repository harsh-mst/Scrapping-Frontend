import React, { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="post-card">
      
      <div className="post-header">
        <div className="user-avatar">
          {post.user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <h3 className="username">{post.user?.username || 'Unknown User'}</h3>
        </div>
      </div>

      
      {post.description && (
        <div className="post-description">
          <p>{post.description}</p>
        </div>
      )}

      
      {post.images && post.images.length > 0 && (
        <div className="post-images">
          <img 
            src={post.images[currentImageIndex]} 
            alt={`Post image ${currentImageIndex + 1}`}
            className="post-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          {post.images.length > 1 && (
            <>
              <button 
                className="nav-btn prev-btn" 
                onClick={prevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button 
                className="nav-btn next-btn" 
                onClick={nextImage}
                aria-label="Next image"
              >
                ›
              </button>
              <div className="image-indicators">
                {post.images.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      
      <div className="post-actions">
        <div className="action-stats">
          <span>{formatNumber(post.likesCount)} reactions</span>
          <span>{formatNumber(post.commentsCount)} comments</span>
        </div>
        <div className="action-divider"></div>
        <div className="action-buttons">
          <button className="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z"></path>
            </svg>
            Like
          </button>
          <button className="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M7 9h10v1H7zm0 4h7v-1H7z"></path>
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18H8v2.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V18h4.5a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0020.5 2zM16 20.5a.5.5 0 01-.5.5h-6a.5.5 0 01-.5-.5V18h7zM21 16.5a.5.5 0 01-.5.5H8v-1h12.5a.5.5 0 01.5.5zm0-2a1.5 1.5 0 00-1.5-1.5H8V7h12z"></path>
            </svg>
            Comment
          </button>
          <button className="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M23 12l-4.61 7H16l4-6H8a3.92 3.92 0 00-4 3.84V17a4 4 0 00.19 1.24L5.12 21H3.2l-.94-2.93A6 6 0 012 17v-.16A5.92 5.92 0 018 11h12l-4-6h2.39z"></path>
            </svg>
            Share
          </button>
          <button className="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
