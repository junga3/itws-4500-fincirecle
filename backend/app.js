// use express and create a / route and server
const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});