require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { checkSchema } = require('express-validator');
const configureDB = require('./config/db');

const User = require('./app/models/user-model');
const Post = require('./app/models/post-model');
const Comment = require('./app/models/comment-model');
const Category = require('./app/models/category-model');

const userRegisterValidationSchema = require('./app/validations/user-register-validations');
const userLoginValidationSchema = require('./app/validations/user-login-validations');
const postValidationSchema = require('./app/validations/post-validations');
const commentValidationSchema = require('./app/validations/comment-validations');
const categoryValidationSchema = require('./app/validations/category-validations');

const userController = require('./app/controllers/user-controller');
const authenticateUser = require('./app/middlewares/authenticateUser');
const postController = require('./app/controllers/post-controller');
const commentController = require('./app/controllers/comment-controller');

const app = express();
configureDB();

app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/users/register', checkSchema(userRegisterValidationSchema), userController.register);
app.post('/api/users/login', checkSchema(userLoginValidationSchema), userController.login);

app.get('/api/users/profile', authenticateUser, userController.profile);
app.put('/api/users/profile', authenticateUser, userController.update);

app.get('/api/posts', postController.posts);
app.get('/api/posts/myPosts', authenticateUser, postController.myPosts);
app.get('/api/posts/:id', postController.single);
app.post('/api/posts', authenticateUser, postController.upload, checkSchema(postValidationSchema), postController.create); // Added Multer middleware
app.put('/api/posts/:id', authenticateUser, checkSchema(postValidationSchema), postController.update);
app.delete('/api/posts/:id', authenticateUser, postController.remove);

app.post('/api/posts/:postId/comments', authenticateUser, checkSchema(commentValidationSchema), commentController.create);
app.get('/api/posts/:postId/comments', commentController.comments);
app.put('/api/posts/:postId/comments/:commentId', authenticateUser, checkSchema(commentValidationSchema), commentController.update);
app.delete('/api/posts/:postId/comments/:commentId', authenticateUser, commentController.delete);

app.listen(process.env.PORT, () => {
    console.log('Server running on port', process.env.PORT);
});