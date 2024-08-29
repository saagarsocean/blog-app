import React, { useState } from 'react';
import axios from '../../api';
import './CommentForm.css';

const CommentForm = ({ postId, onAddComment }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, { content }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      setContent('');
      setError(null);
      onAddComment(response.data);
    } catch (err) {
      console.error('Comment submission error', err);
      setError(err.message);
    }
  };

  return (
    <div className="comment-card">
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Comment</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your comment"
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default CommentForm;
