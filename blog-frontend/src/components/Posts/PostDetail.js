import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api';
import CommentForm from '../Comments/CommentForm';
import CommentList from '../Comments/CommentList';
import { useAuth } from '../../context/AuthContext';
import './PostDetail.css'; // Import the CSS file for styling

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const fetchPostAndComments = useCallback(async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        axios.get(`/api/posts/${id}`),
        axios.get(`/api/posts/${id}/comments`)
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Post and comments fetch error', error);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleAddComment = () => {
    fetchPostAndComments();
  };

  const handleUpdateComment = (commentId, content) => {
    setComments(comments.map(comment => (comment._id === commentId ? { ...comment, content } : comment)));
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      navigate('/'); // Redirect to home or another page after deletion
    } catch (error) {
      console.error('Post deletion error', error);
    }
  };

  return (
    <div className="post-detail">
      {post ? (
        <div className="post-card">
          <h1 className="post-title">{post.title}</h1>
          <div className="line"></div> {/* Add line separator */}
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="line"></div> {/* Add line separator */}
          {post.featuredImage && <img className="post-image" src={`http://localhost:5227/${post.featuredImage}`} alt={post.title} />}

          {/* Debugging logs */}
          {console.log("User object:", user)}
          {console.log("Post author ID:", post.author)}

          {user && user.profile && user.profile._id === post.author && (
            <div className="post-actions">
              <button onClick={() => navigate(`/edit-post/${id}`)}>Edit</button>
              <button onClick={handleDeletePost}>Delete</button>
            </div>
          )}

          {user && <CommentForm postId={id} onAddComment={handleAddComment} />}
          <CommentList
            post={post}
            comments={comments}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetail;
