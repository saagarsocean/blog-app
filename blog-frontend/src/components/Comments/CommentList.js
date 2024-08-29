import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { useAuth } from '../../context/AuthContext';
import './CommentList.css'; // Import the CSS file for styling

const CommentList = ({ post, comments = [], onUpdateComment, onDeleteComment }) => {
  console.log('Post:', post);
  console.log('Comments:', comments);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    console.log('User:', user);
    if (user && user.profile) {
      console.log('User Profile:', user.profile);
    }
    console.log('Comments:', comments);
  }, [user, comments]);

  const handleEditComment = async (commentId, content) => {
    try {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };
      await axios.put(`/api/posts/${post._id}/comments/${commentId}`, { content }, { headers });
      onUpdateComment(commentId, content);
      setEditedCommentId(null);
    } catch (error) {
      console.error('Comment update error', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };
      await axios.delete(`/api/posts/${post._id}/comments/${commentId}`, { headers });
      onDeleteComment(commentId);
    } catch (error) {
      console.error('Comment deletion error', error);
    }
  };

  return (
    <div className="comment-list">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <p><strong>{comment.author.username}</strong>: {comment.content}</p>
            {editedCommentId === comment._id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditComment(comment._id, editedContent);
                }}
              >
                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                <button type="submit" className="edit-button">Save</button>
                <button onClick={() => setEditedCommentId(null)} className="cancel-button">Cancel</button>
              </form>
            ) : (
              <>
                {user && user.profile && (
                  <>
                    {console.log('Comment Author:', comment.author)}
                    {comment.author._id === user.profile._id ? (
                      <>
                        <button
                          onClick={() => {
                            setEditedCommentId(comment._id);
                            setEditedContent(comment.content);
                          }}
                          className="edit-button"
                        >
                          Edit
                        </button>
                      </>
                    ) : null}
                    {post.author === user.profile._id || comment.author._id === user.profile._id ? (
                    <button className="delete-comment-button" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default CommentList;
