const Comment = require('../models/comment-model');
const { validationResult } = require('express-validator');

const commentController = {};

commentController.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;
        const postId = req.params.postId;
        console.log(postId);
        const comment = new Comment(body);
        comment.author = req.user.id;
        comment.post = postId;
        await comment.save();
        // Populate author info before sending response
        await comment.populate('author', 'username');
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};

commentController.comments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        if (!comments) {
            return res.status(404).json({ errors: 'record not found' });
        }
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};

commentController.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errros: errors.array() });
    }
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const body = req.body;
        const comment = await Comment.findOneAndUpdate({ post: postId, _id: commentId }, body, { new: true }).populate('author', 'username');
        if (!comment) {
            return res.status(404).json({ errors: 'record not found' });
        }
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};

commentController.delete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const comment = await Comment.findOneAndDelete({ post: postId, _id: commentId }, { new: true }).populate('author', 'username');
        if (!comment) {
            return res.status(404).json({ errros: 'record not found' });
        }
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};

module.exports = commentController;
