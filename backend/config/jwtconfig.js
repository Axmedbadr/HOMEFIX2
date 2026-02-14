require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h'
};