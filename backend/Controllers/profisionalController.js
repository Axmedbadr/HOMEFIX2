const Professional = require('../models/Professional');

const professionalController = {
  // Get all professionals
  getAll: async (req, res) => {
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
  },

  // Create professional
  create: async (req, res) => {
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
  },

  // Update professional
  update: async (req, res) => {
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
  },

  // Delete professional
 delete: async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);

    if (!professional) {
      return res.status(404).json({ msg: 'Professional not found' });
    }

    res.status(200).json({ msg: 'Professional removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
}
}

module.exports = professionalController;