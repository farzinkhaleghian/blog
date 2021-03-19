const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const eventHandler = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title} = data;
        posts[id] = {
            id,
            title,
            comments:[]
        };
    };
    if (type === 'CommentCreated') {
        const { postId, id, content, status } = data;
        posts[postId].comments.push({
            id,
            content,
            status
        });
    };
    if(type === 'CommentUpdated'){
        const { postId, id, content, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(e => e.id === id);
        comment.status = status;
        comment.content = content;
    };
};

const posts = {};
app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body; 

    eventHandler(type, data);

    res.send({})
});

const port = process.env.PORT || 5002;
app.listen(port, async () => {
    console.log(`app is running on port ${port} ...`);

    const res = await axios.get('http://localhost:5005/events');

    for (let event of res.data) {
        console.log('Event processin...', event.type);

        eventHandler(event.type, event.data);
    }
})