const Post = require('../models/post-model');
const User = require('../models/user-model'); // Ensure you have the user model imported
const { validationResult } = require('express-validator');
const multer = require('multer');

const postController = {};

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

postController.upload = upload.single('featuredImage');

postController.posts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

postController.single = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: err });
    }
};

postController.myPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id }).populate('author', 'username').populate('comments').populate('categories');
        if (!posts) {
            return res.status(404).json({ errors: 'Record not found' });
        }
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};

postController.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, content } = req.body;
        let featuredImage = req.file ? req.file.path.replace(/\\/g, '/') : '';
        const post = new Post({ title, content, featuredImage, author: req.user.id });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ errors: err.message });
    }
};

postController.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = req.params.id;
        const body = req.body;
        const post = await Post.findOneAndUpdate({ author: req.user.id, _id: id }, body, { new: true });
        if (!post) {
            return res.status(404).json({ errors: 'Post not found or not authorized' });
        }
        if (req.file) {
            post.featuredImage = req.file.path.replace(/\\/g, '/'); // Assuming the path is stored in the database
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};

// Delete a post
postController.remove = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findOneAndDelete({ author: req.user.id, _id: id });
        if (!post) {
            return res.status(404).json({ errors: 'Record not found or not authorized' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};

module.exports = postController;
