import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, User, Briefcase, Send, Loader2, Mail, Building } from 'lucide-react';
import './recommendation.css';
import './Pages.css';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import ReCAPTCHA from "react-google-recaptcha";

const validateEmail = (email) => {
  const cleanEmail = email.trim().toLowerCase();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(cleanEmail);
};

export default function Recommendations() {
  const recaptchaRef = useRef();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // NEW: State to track dark mode
  const [isDark, setIsDark] = useState(false);
  console.log("Current theme state isDark:", isDark);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    email: '',
    company: '',
  });

  // NEW: Effect to watch for theme changes automatically
  useEffect(() => {
    const checkTheme = () => {
      // If the HTML tag has 'light-theme', it is light mode. Otherwise, it is dark mode.
      const isLightMode = document.documentElement.classList.contains('light-theme');
      setIsDark(!isLightMode);
    };

    // Initial check when the component first loads
    checkTheme();

    // Watch the <html> tag for any changes to its 'class' attribute
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // 1. GET Request: Fetch recommendations from Supabase
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
      } else {
        setRecs(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    const channel = supabase
      .channel('recommendations-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recommendations' },
        () => fetchRecommendations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // live email validation
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
      }
    }
  };

  // 2. POST Request: Send new recommendation to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    setEmailError('');

    // 🛑 1. Verify reCAPTCHA on the frontend first
    const recaptchaToken = recaptchaRef.current.getValue();
    
    if (!recaptchaToken) {
      setSubmitStatus('');
      setEmailError('Please check the reCAPTCHA box to prove you are human.');
      return;
    }

    // 🛑 2. Validate email before optimistic UI
    const formattedData = {
      ...formData,
      email: formData.email.trim().toLowerCase()
    };

    if (!validateEmail(formattedData.email)) {
      setSubmitStatus('');
      setEmailError('Please enter a valid email address');
      return;
    }

    // 3. Optimistic UI update
    const optimisticRec = {
      id: crypto.randomUUID(),
      ...formData,
      created_at: new Date().toISOString()
    };

    setRecs((prev) => [optimisticRec, ...prev]);

    // 4. Insert into Supabase
    const { error } = await supabase
      .from('recommendations')
      .insert([formattedData]);

    if (error) {
      console.error('Error inserting:', error);
      setSubmitStatus('error');
      
      // Rollback optimistic UI on error
      setRecs((prev) => prev.filter((rec) => rec.id !== optimisticRec.id));
      recaptchaRef.current.reset(); // Reset recaptcha so they can try again
    } else {
      setSubmitStatus('success');
      
      // Clear form
      setFormData({
        name: '',
        designation: '',
        email: '',
        company: '',
        description: ''
      });
      
      recaptchaRef.current.reset(); // Reset recaptcha after success

      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  return (
    <>
      <div className="page-container recommendations-page">
        <div className="page-header">
          <h2><MessageSquare className="title-icon" /> Peer Recommendations</h2>
          <p>What colleagues, managers, and clients say about working with me.</p>
        </div>

        <div className="recommendations-layout">
          {/* Display List Column */}
          <div className="recs-display-section">
            <h3>Recent Recommendations</h3>
            
            {loading ? (
              <div className="loading-state">
                <Loader2 className="spinner" />
                <p>Fetching data ...</p>
              </div>
            ) : recs.length === 0 ? (
              <p className="empty-state">No recommendations yet. Be the first to add one below!</p>
            ) : (
              <div className="recs-grid">
                {recs.map((rec) => (
                  <div key={rec.id} className="glass-card rec-card">
                    <p className="rec-text">"{rec.description}"</p>
                    <div className="rec-author">
                      <div className="author-avatar">
                        {rec.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{rec.name}</h4>
                        <p className="author-title">{rec.designation} @ {rec.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Form Column */}
          <div className="recs-form-section">
            <div className="glass-card form-wrapper">
              <h3>Leave a Recommendation</h3>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Building className="input-icon" />
                  <input
                    type="text"
                    name="company"
                    placeholder="Your Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Briefcase className="input-icon" />
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation (e.g., Senior Dev)"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group textarea-group">
                  <textarea
                    name="description"
                    placeholder="Your recommendation text..."
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {emailError && <p className="error-text" style={{color: '#ef4444', marginBottom: '10px'}}>{emailError}</p>}

                {/* UPDATED RECAPTCHA HERE */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ReCAPTCHA
                    key={isDark ? 'dark-mode' : 'light-mode'} /* Forces reload on theme change */
                    theme={isDark ? 'dark' : 'light'}         /* Sets the visual theme */
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    ref={recaptchaRef}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={submitStatus === 'Submitting...'}>
                  {submitStatus === 'Submitting...' ? <Loader2 className="spinner" size={16} /> : <Send size={16} />} 
                  {submitStatus === 'Submitting...' ? ' Submitting...' : ' Submit'}
                </button>

                {submitStatus === 'success' && <p className="form-status" style={{color: '#10b981', marginTop: '10px'}}>Recommendation submitted successfully!</p>}
                {submitStatus === 'error' && <p className="form-status" style={{color: '#ef4444', marginTop: '10px'}}>Failed to submit. Please try again.</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}