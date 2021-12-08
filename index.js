const connectMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

connectMongo();

app.use(express.json());
app.use(cors());

// Available routes
app.use('/api/v1/borrower', require('./routes/borrower'));
app.use('/api/v1/item', require('./routes/item'));
app.use('/api/v1/auth', require('./routes/auth'));

// Hello world route
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});