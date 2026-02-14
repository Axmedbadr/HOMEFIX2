import { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import '../styles/admin-dashboard.css';
import '../styles/global.css'
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  X, 
  Star, 
  Wrench, 
  Zap, 
  Paintbrush 
} from 'lucide-react';
import { 
  getProfessionals, 
  createProfessional, 
  updateProfessional, 
  deleteProfessional 
} from '../lib/api';

export function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    skill: 'Painting',
    phone_number: '',
    rating: 5.0,
    status: 'Active',
  });

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const data = await getProfessionals();
      setProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingProfessional) {
        result = await updateProfessional(editingProfessional._id, formData);
      } else {
        result = await createProfessional(formData);
      }

      if (result.success !== false) {
        setShowModal(false);
        setEditingProfessional(null);
        resetForm();
        fetchProfessionals();
      } else {
        alert(result.message || 'Error saving professional. Please try again.');
      }
    } catch (error) {
      console.error('Error saving professional:', error);
      alert('Network error occurred');
    }
  };

  const handleEdit = (professional) => {
    setEditingProfessional(professional);
    setFormData({
      full_name: professional.full_name,
      skill: professional.skill,
      phone_number: professional.phone_number,
      rating: professional.rating,
      status: professional.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this professional?')) return;
    try {
      const result = await deleteProfessional(id);
      if (result.success !== false) {
        fetchProfessionals();
      } else {
        alert(result.message || 'Error deleting professional. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting professional:', error);
      alert('Network error occurred');
    }
  };

  const handleToggleStatus = async (professional) => {
    const newStatus = professional.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const result = await updateProfessional(professional._id, { 
        ...professional, 
        status: newStatus 
      });

      if (result.success !== false) {
        fetchProfessionals();
      } else {
        alert(result.message || 'Error updating status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      skill: 'Painting',
      phone_number: '',
      rating: 5.0,
      status: 'Active',
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProfessional(null);
    resetForm();
  };

  const getSkillIcon = (skill) => {
    switch (skill) {
      case 'Painting':
        return <Paintbrush className="w-5 h-5" />;
      case 'Electricity':
        return <Zap className="w-5 h-5" />;
      case 'Plumbing':
        return <Wrench className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div>
            <a href="/" className="view-site-link">View Site</a>
            <button
              onClick={() => signOut()}
              className="signout-button"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-subtitle">Manage Professionals</h2>
          <button
            onClick={() => setShowModal(true)}
            className="add-professional-button"
          >
            <Plus className="w-5 h-5" />
            Add Professional
          </button>
        </div>

        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-container">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-th">Name</th>
                    <th className="table-th">Skill</th>
                    <th className="table-th">Phone Number</th>
                    <th className="table-th">Rating</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {professionals.map((professional) => (
                    <tr key={professional._id} className="table-tr">
                      <td className="table-td">
                        <div className="professional-name">
                          {professional.full_name}
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="skill-cell">
                          {getSkillIcon(professional.skill)}
                          <span className="skill-name">
                            {professional.skill}
                          </span>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="professional-name">
                          {professional.phone_number}
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="rating-cell">
                          <Star className="rating-star" />
                          <span className="rating-value">
                            {professional.rating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="table-td">
                        <span
                          className={`status-badge ${
                            professional.status === 'Active'
                              ? 'status-active'
                              : 'status-suspended'
                          }`}
                        >
                          {professional.status}
                        </span>
                      </td>
                      <td className="table-td actions-cell">
                        <div className="actions-container">
                          <button
                            onClick={() => handleEdit(professional)}
                            className="action-button"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(professional)}
                            className={
                              professional.status === 'Active'
                                ? 'suspend-button'
                                : 'activate-button'
                            }
                            title={
                              professional.status === 'Active'
                                ? 'Suspend'
                                : 'Activate'
                            }
                          >
                            {professional.status === 'Active' ? (
                              <Ban className="w-5 h-5" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(professional._id)}
                            className="delete-button"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProfessional ? 'Edit Professional' : 'Add Professional'}
              </h3>
              <button
                onClick={closeModal}
                className="close-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-field">
                <label className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Skill
                </label>
                <select
                  required
                  value={formData.skill}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skill: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  <option value="Painting">Painting</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Plumbing">Plumbing</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="form-input"
                  placeholder="555-0123"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Rating (1.0 - 5.0)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseFloat(e.target.value),
                    })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Status
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  {editingProfessional ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}