const express = require('express');
const Professional = require('../modols/ProfessionalModel');
const auth = require('../middleware/authMiddleware');
const { validateProfessional, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route    GET api/professionals
// @desc     Get all professionals (public route)
// @access   Public
router.get('/', async (req, res) => {
  try {
    const { skill } = req.query;
    let query = { status: 'Active' };
    
    if (skill) {
      query.skill = skill;
    }
    
    const professionals = await Professional.find(query).sort({ rating: -1 });
    res.json(professionals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/professionals
// @desc     Create a professional (admin only)
// @access   Private
router.post('/', auth, validateProfessional, handleValidationErrors, async (req, res) => {
  try {
    const newProfessional = new Professional({
      ...req.body
    });

    const professional = await newProfessional.save();
    res.json(professional);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/professionals/:id
// @desc     Update a professional (admin only)
// @access   Private
router.put('/:id', auth, validateProfessional, handleValidationErrors, async (req, res) => {
  try {
    const professional = await Professional.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );

    if (!professional) {
      return res.status(404).json({ msg: 'Professional not found' });
    }

    res.json(professional);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/professionals/:id
// @desc     Delete a professional (admin only)
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Bedel findByIdAndRemove -> findByIdAndDelete
    const professional = await Professional.findByIdAndDelete(req.params.id);

    if (!professional) {
      return res.status(404).json({ msg: 'Professional not found' });
    }

    res.status(200).json({ msg: 'Professional removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});


module.exports = router;