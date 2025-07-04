const express = require('express');

const app = express();
require('dotenv').config();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/gigs', require('./routes/gigs.routes'));


app.listen(8000, () => {
    console.log('Server is running on port 3000');
});





