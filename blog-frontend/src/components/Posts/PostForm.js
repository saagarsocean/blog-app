import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PostForm.css';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (featuredImage) {
        formData.append('featuredImage', featuredImage);
      }

      const response = await axios.post('http://localhost:5227/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token')
        }
      });
      console.log('Post created:', response.data);
      setTitle('');
      setContent('');
      setFeaturedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setError(null);
    } catch (err) {
      console.error('Post submission error:', err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <h3>Title</h3>
        <div className="form-group">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>
      </div>

      <div className="card">
        <h3>Content</h3>
        <div className="form-group">
          <ReactQuill value={content} onChange={setContent} placeholder="Enter content" />
        </div>
      </div>

      <div className="card">
        <h3>Featured Image</h3>
        <div className="form-group">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files[0])}
            ref={fileInputRef}
            className="file-input"
          />
        </div>
      </div>

      <button type="submit">Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PostForm;
