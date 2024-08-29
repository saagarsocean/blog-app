import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api';
import { useAuth } from '../../context/AuthContext';
//import './EditPost.css'; // Optional: Import CSS for styling

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error('Post fetch error', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (featuredImage) {
      formData.append('featuredImage', featuredImage);
    }

    try {
      await axios.put(`/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Post update error', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="edit-post">
      <h1>Edit Post</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image</label>
          <input type="file" id="featuredImage" onChange={handleFileChange} />
        </div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
