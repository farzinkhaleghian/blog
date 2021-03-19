const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/post/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/post/:id/comment', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:5005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });
    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Received event: ', req.body.type);

    const { type, data } = req.body;
    if(type === 'CommentModerated'){
        const { postId, id, status, content } = data;
        const comment = commentsByPostId[postId].find(e => e.id === id);
        comment.status = status

        await axios.post('http://localhost:5005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                status,
                postId
            }
        });
    };
    res.send({});
})

app.listen(5001, () => {
  console.log('Listening on 5001');
});
