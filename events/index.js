const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const events = [];
app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event)

    axios.post('http://localhost:5000/events', event);
    axios.post('http://localhost:5001/events', event);
    axios.post('http://localhost:5002/events', event);
    axios.post('http://localhost:5003/events', event);

    res.send({status: 'OK'});
});

// Async Request for missing events

app.get('/events', (req, res) => {
    res.send(events);
});
const port = process.env.PORT || 5005;
app.listen(port, () => {
    console.log(`app is running on port ${port} ...`)
})