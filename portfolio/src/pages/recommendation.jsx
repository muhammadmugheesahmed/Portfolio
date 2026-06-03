import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, User, Briefcase, Send, Loader2, Mail, Building } from 'lucide-react';
import './recommendation.css';
import './Pages.css';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { Turnstile } from '@marsidev/react-turnstile';

const validateEmail = (email) => {
  const cleanEmail = email.trim().toLowerCase();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(cleanEmail);
};

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // NEW: Ref to manually control the Turnstile widget (like resetting it)
  const turnstileRef = useRef(); 

  // NEW: State to hold the Turnstile token
  const [turnstileToken, setTurnstileToken] = useState(''); 
  
  const [isDark, setIsDark] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    email: '',
    company: '',
  });

  useEffect(() => {
    const checkTheme = () => {
      const isLightMode = document.documentElement.classList.contains('light-theme');
      setIsDark(!isLightMode);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    setEmailError('');

    // 🛑 1. Verify Turnstile on the frontend first
    if (!turnstileToken) {
      setSubmitStatus('');
      setEmailError('Please complete the security check to prove you are human.');
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

    const optimisticRec = {
      id: crypto.randomUUID(),
      ...formData,
      created_at: new Date().toISOString()
    };

    setRecs((prev) => [optimisticRec, ...prev]);

    const { error } = await supabase
      .from('recommendations')
      .insert([formattedData]);

    if (error) {
      console.error('Error inserting:', error);
      setSubmitStatus('error');
      setRecs((prev) => prev.filter((rec) => rec.id !== optimisticRec.id));
      
      // Reset the widget so they can try again
      turnstileRef.current?.reset(); 
      setTurnstileToken(''); 
    } else {
      setSubmitStatus('success');
      setFormData({
        name: '',
        designation: '',
        email: '',
        company: '',
        description: ''
      });
      
      // Reset the widget after a successful submission
      turnstileRef.current?.reset(); 
      setTurnstileToken(''); 
      
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

          <div className="recs-form-section">
            <div className="glass-card form-wrapper">
              <h3>Leave a Recommendation</h3>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <User className="input-icon" />
                  <input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <Mail className="input-icon" />
                  <input type="email" name="email" placeholder="Your Email Address" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <Building className="input-icon" />
                  <input type="text" name="company" placeholder="Your Company Name" value={formData.company} onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <Briefcase className="input-icon" />
                  <input type="text" name="designation" placeholder="Designation (e.g., Senior Dev)" value={formData.designation} onChange={handleChange} required />
                </div>

                <div className="input-group textarea-group">
                  <textarea name="description" placeholder="Your recommendation text..." rows="6" value={formData.description} onChange={handleChange} required />
                </div>

                {emailError && <p className="error-text" style={{color: '#ef4444', marginBottom: '10px'}}>{emailError}</p>}

                {/* DYNAMIC TURNSTILE HERE */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Turnstile
                    ref={turnstileRef} // <--- The missing piece!
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    options={{
                      theme: isDark ? 'dark' : 'light',
                    }}
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