const { body, validationResult } = require('express-validator');

const validateProfessional = [
  body('full_name', 'Full name is required').not().isEmpty().trim(),
  body('skill', 'Skill is required').isIn(['Painting', 'Electricity', 'Plumbing']),
  body('phone_number', 'Please enter a valid phone number').matches(/^[\+]?[1-9][\d]{0,15}$/),
  body('rating', 'Rating must be between 1.0 and 5.0').optional().isFloat({ min: 1.0, max: 5.0 }),
  body('status', 'Status must be Active or Suspended').optional().isIn(['Active', 'Suspended'])
];

const validateLogin = [
  body('email', 'Please enter a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateProfessional,
  validateLogin,
  handleValidationErrors
};