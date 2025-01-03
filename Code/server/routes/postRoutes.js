const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const sanitize = require('mongo-sanitize');

// Create a new post
router.post('/', async (req, res) => {
    try {
        const sanitizedBody = sanitize(req.body);
        const newPost = new Post(sanitizedBody);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single post
router.get('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const post = await Post.findById(sanitizedId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a post
router.patch('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const sanitizedBody = sanitize(req.body);
        const post = await Post.findById(sanitizedId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        Object.assign(post, sanitizedBody);
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const sanitizedId = sanitize(req.params.id);
        const post = await Post.findById(sanitizedId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
