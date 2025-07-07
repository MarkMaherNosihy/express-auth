const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/gigs', require('./routes/gigs.routes'));


app.listen(8000, () => {
    console.log('Server is running on port 3000');
});





