import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Auth/UserProfile';
import PostList from './components/Posts/PostList';
import PostDetail from './components/Posts/PostDetail';
import PostForm from './components/Posts/PostForm';
import EditPost from './components/Posts/EditPost';
import PrivateRoute from './PrivateRoute';
import {AuthProvider} from './context/AuthContext';

const RoutesComponent = () => (
  <AuthProvider>
    <Header />
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/new-blog" element={<PrivateRoute element={PostForm} />} />
      <Route path="/edit-post/:id" element={<PrivateRoute element={PostForm} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<PrivateRoute element={UserProfile} />} />
      <Route path="/my-blogs" element={<PostList fetchUserPosts={true} />} />
      <Route path="/edit-post/:id" element={<EditPost />} />
    </Routes>
    <Footer />
  </AuthProvider>
);

export default RoutesComponent;
