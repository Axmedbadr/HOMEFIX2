const express = require('express');
const cors = require('cors');
const path = require('path');
const  connectDB  = require("./config/database");

require('dotenv').config();

const app = express();

// Connect Database


// Middleware
app.use(cors());
app.use(express.json());
connectDB();
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/professionals', require('./routes/professionalsRoutes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
