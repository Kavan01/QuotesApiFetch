const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// App setup
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/quotesApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Schema and Model
const postSchema = new mongoose.Schema({
    quote: String,
});
const Post = mongoose.model('Post', postSchema);

// Routes
const axios = require('axios');

app.get('/quote', async (req, res) => {
    try {
        const response = await axios.get('https://favqs.com/api/qotd');
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching quote' });
    }
});

app.get('/api/random-quote', async (req, res) => {
    try {
        const response = await axios.get('https://favqs.com/api/qotd');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quote.' });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/posts', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const newPost = new Post({ quote: req.body.quote });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));