const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());


app.post('/events', async (req, res) => {
    const { data, type} = req.body;
    if(type === 'CommentCreated'){
        const status = data.content.includes('test') ? 'rejected' : 'approved';

        await axios.post('http://localhost:5005/events', {
            type: 'CommentModerated',
            data: {
                content: data.content,
                id: data.id,
                status,
                postId: data.postId
            }
        });
    };
    res.send({});
});


const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log(`app is running on port ${port} ...`)
})