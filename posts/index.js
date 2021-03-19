const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());
//start without db
const posts = {};
app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/post', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, title
    };
    await axios.post('http://localhost:5005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    });
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received event: ', req.body.type);
    res.send({});
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`app is running on port ${port} ...`)
})