import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import './PostList.css';

const PostList = ({ fetchUserPosts }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = fetchUserPosts ? '/api/posts/myPosts' : '/api/posts';
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Posts fetch error', error);
      }
    };

    fetchPosts();
  }, [fetchUserPosts]);

  const truncateContent = (content, numLines) => {
    const lines = content.split('\n');
    return lines.slice(0, numLines).join('\n') + '...';
  };

  return (
    <div className="post-grid">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="post-card" key={post._id}>
            <h2 className="post-card-title"><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>
            {post.featuredImage && (
              <img className="post-card-image" src={`http://localhost:5227/${post.featuredImage}`} alt={post.title} />
            )}
            <div className="post-card-content">
              <p dangerouslySetInnerHTML={{ __html: truncateContent(post.content, 6) }}></p>
            </div>
            <Link to={`/posts/${post._id}`} className="read-more">Read More</Link>
          </div>
        ))
      ) : (
        <div className="create-first-blog-card">
          <h2>Create Your First Blog</h2>
          <Link to="/new-blog" className="create-blog-link">Create Blog</Link>
        </div>
      )}
    </div>
  );
};

export default PostList;
