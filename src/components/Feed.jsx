import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from './PostCard';
import './Feed.css';

const Feed = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          // `http://localhost:5000/api/v1/posts/${username}`,
          `https://cotyledonous-lenny-overslavish.ngrok-free.dev/api/v1/posts/${username}`,
          // `https://scrapping-backend-i9hu.onrender.com/api/v1/posts/${username}`
          // `https://scrapping-backend-ykua.onrender.com/api/v1/posts/${username}`,
        );
        
        console.log('Feed response:', response.data);
        
        // Handle different response structures
        // It could be:
        // 1. Array directly: [ ... ]
        // 2. Wrapped in data: { data: [ ... ] }
        // 3. Wrapped in posts: { posts: [ ... ] }
        // 4. Double wrapped: { data: { posts: [ ... ] } }  <-- consistently used in ScrapeUser
        let postsData = [];
        
        if (response.data.data && Array.isArray(response.data.data.posts)) {
            // Case: { statusCode: 200, data: { posts: [...] }, ... }
            postsData = response.data.data.posts;
        } else if (Array.isArray(response.data.posts)) {
             // Case: { posts: [...] }
             postsData = response.data.posts;
        } else if (Array.isArray(response.data.data)) {
            // Case: { data: [...] }
            postsData = response.data.data;
        } else if (Array.isArray(response.data)) {
            // Case: [...]
            postsData = response.data;
        }

        if (!postsData || !Array.isArray(postsData)) {
           console.warn('Could not find posts array in response:', response.data);
           // Default to empty array if not found, rather than throwing error immediately
           // unless strictly necessary.
           postsData = [];
        }
        
        const sortedPosts = postsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setPosts(sortedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Feed error:', err);
        if (err.response) {
          // Server responded with an error
          setError(err.response.data?.message || 'Failed to load posts.');
        } else if (err.request) {
          // Request made but no response (server down, network issue)
          setError('Cannot connect to server. Please check if the backend is running.');
        } else {
          // Something else went wrong
          setError(err.message || 'An unexpected error occurred.');
        }
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading posts from {username}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Posts</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <button onClick={() => navigate('/')} className="back-button-small">
          ← Back
        </button>
        <h2>Posts from @{username}</h2>
        <p className="posts-count">{posts.length} posts</p>
      </div>

      <div className="feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found for this user</p>
            <button onClick={() => navigate('/')} className="scrape-another">
              Scrape Another User
            </button>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
