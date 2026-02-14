const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/jwtconfig');

const authController = {
  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      // Create payload
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      // Sign token
      const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });

      res.json({ 
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during login' 
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      res.json({ 
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error' 
      });
    }
  }
};

module.exports = authController;