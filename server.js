const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/connection');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.connect(err => {
    if (err) throw err;
    console.log('Connected to employees database');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`URL: http://localhost:${PORT}`);
    });
});