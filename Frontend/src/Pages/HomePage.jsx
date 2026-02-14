import { useEffect, useState } from 'react';
import { Star, Wrench, Zap, Paintbrush, ArrowRight } from 'lucide-react';
import { getProfessionals, getProfessionalsBySkill } from '../lib/api';

export function HomePage() {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (selectedSkill === 'All') {
      setFilteredProfessionals(professionals);
    } else {
      setFilteredProfessionals(
        professionals.filter((prof) => prof.skill === selectedSkill)
      );
    }
  }, [selectedSkill, professionals]);

  const fetchProfessionals = async () => {
    try {
      const data = await getProfessionals();
      setProfessionals(data);
      setFilteredProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`star-icon ${star <= rating ? 'filled fill-blue-400' : ''}`}
          />
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
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

  const skillButtons = [
    { label: 'All', icon: null },
    { label: 'Painting', icon: <Paintbrush className="w-5 h-5" /> },
    { label: 'Electricity', icon: <Zap className="w-5 h-5" /> },
    { label: 'Plumbing', icon: <Wrench className="w-5 h-5" /> },
  ];

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="flex justify-between items-center">
            <h1 className="logo">Home Services</h1>
            <nav>
              <a href="/admin" className="admin-link">
                Admin Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Your Home, Our <span className="text-blue-200">Experts</span>
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Connect with trusted home service professionals. Find painters, electricians, and plumbers ready to help with your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById('professionals-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="browse-btn"
              >
                Browse Professionals
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="hero-card">
              <Paintbrush className="w-8 h-8 text-blue-200 mb-3" />
              <h3 className="font-semibold mb-2">Painting</h3>
              <p className="text-sm text-blue-100">Professional painting services</p>
            </div>
            <div className="hero-card">
              <Zap className="w-8 h-8 text-blue-200 mb-3" />
              <h3 className="font-semibold mb-2">Electricity</h3>
              <p className="text-sm text-blue-100">Expert electrical work</p>
            </div>
            <div className="hero-card">
              <Wrench className="w-8 h-8 text-blue-200 mb-3" />
              <h3 className="font-semibold mb-2">Plumbing</h3>
              <p className="text-sm text-blue-100">Quality plumbing solutions</p>
            </div>
            <div className="hero-card">
              <Star className="w-8 h-8 text-blue-200 mb-3 fill-blue-200" />
              <h3 className="font-semibold mb-2">Top Rated</h3>
              <p className="text-sm text-blue-100">Trusted professionals</p>
            </div>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="mb-12">
          <h2 className="section-title">Find Your Professional</h2>
          <p className="section-subtitle">Select a service type to view available professionals</p>
          <div className="skill-buttons">
            {skillButtons.map((button) => (
              <button
                key={button.label}
                onClick={() => setSelectedSkill(button.label)}
                className={`skill-button ${selectedSkill === button.label ? 'active' : ''}`}
              >
                {button.icon}
                {button.label}
              </button>
            ))}
          </div>
        </div>

        <div id="professionals-section">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="no-results">
              <p>No professionals found for this service.</p>
            </div>
          ) : (
            <div className="professionals-grid">
              {filteredProfessionals.map((professional) => (
                <div
                  key={professional._id}
                  className="professional-card"
                >
                  <div className="card-header"></div>
                  <div className="card-content">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="professional-name">
                          {professional.full_name}
                        </h3>
                        <div className="skill-info">
                          {getSkillIcon(professional.skill)}
                          <span className="font-medium">{professional.skill}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {renderStars(professional.rating)}
                      </div>

                      <div className="contact-section">
                        <p className="contact-label">Contact Number</p>
                        <p className="phone-number">
                          {professional.phone_number}
                        </p>
                        <p className="call-note">Manually call this number</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>Painting</li>
                <li>Electricity</li>
                <li>Plumbing</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>Our Mission</li>
                <li>How It Works</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="footer-divider">
            <p className="text-center text-blue-300">
              © 2026 Home Services. Connect with trusted professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}