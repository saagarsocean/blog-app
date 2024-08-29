import React, { useState, useEffect } from 'react';
import axios from '../../api';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: '',
          profilePicture: null,
        });
      } catch (error) {
        console.error('Profile fetch error', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const updatedFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updatedFormData.append(key, value);
    });

    try {
      const response = await axios.put('/api/users/profile', updatedFormData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUser(prevUser => ({
        ...prevUser,
        profilePicture: response.data.profilePicture
      }));
  
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Error updating profile. Please try again.');
      console.error('Profile update error', error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="profile-container">
        {user ? (
          <>
            <div className="profile-card">
              <h2 className="card-title">Profile</h2>
              <div className="card">
                <p>Username: {user.username}</p>
              </div>
              <div className="card">
                <p>Email: {user.email}</p>
              </div>
              <div className="card">
                <p>Bio: {user.bio}</p>
              </div>
              {user.profilePicture && (
                <div className="card">
                  <img src={user.profilePicture} alt="Profile" />
                </div>
              )}
            </div>
            <div className="update-profile-card">
              <h2 className="card-title">Update Profile</h2>
              <form className="update-form" onSubmit={handleSubmit}>
                <div className="card">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="card">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="card">
                  <label htmlFor="password">Password (leave blank to keep current):</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="card">
                  <div className="file-container">
                    <label htmlFor="profilePicture" className="custom-file-upload">Choose File</label>
                    <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
