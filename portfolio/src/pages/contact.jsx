import React, { useRef, useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Mail, User, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './contact.css';
import './Pages.css';
import Footer from '../components/Footer';

export default function Contact() {
  const formRef = useRef();
  const recaptchaRef = useRef(); 
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // NEW: State to track dark mode
  const [isDark, setIsDark] = useState(false);

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

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    // 1. Grab the reCAPTCHA token
    const recaptchaToken = recaptchaRef.current.getValue();
    
    // 2. Stop the submission if they haven't checked the box
    if (!recaptchaToken) {
      setAlert({ type: 'error', message: 'Please check the reCAPTCHA box to prove you are human.' });
      setLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);
    const payload = {
      from_name: formData.get('from_name'),
      from_email: formData.get('from_email'),
      message: formData.get('message'),
      recaptchaToken: recaptchaToken // Send token to backend for verification
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/.netlify/functions/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: 'success',
          message: 'Message sent successfully! Check your Email inbox for a confirmation.'
        });
        formRef.current.reset();
        recaptchaRef.current.reset(); // Reset checkbox after success
      } else {
        throw new Error(data.error || 'Server rejected the application request.');
      }
    } catch (error) {
      console.error('Submission Backend Error:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Oops! Something went wrong. Please try again.'
      });
      recaptchaRef.current.reset(); // Reset checkbox on error so they can try again
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-container contact-page">
        <div className="contact-card glass-card">
          <div className="contact-header">
            <h2>Get in Touch</h2>
            <p>Have an interesting project, job opportunity, or just want to say hello? Drop a message below!</p>
          </div>

          {alert.message && (
            <div className={`alert-box ${alert.type}`}>
              {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{alert.message}</span>
            </div>
          )}

          <form ref={formRef} onSubmit={sendEmail} className="contact-form">
            <div className="input-wrapper">
              <User className="form-icon" size={18} />
              <input type="text" name="from_name" placeholder="Your Name" required disabled={loading} />
            </div>

            <div className="input-wrapper">
              <Mail className="form-icon" size={18} />
              <input type="email" name="from_email" placeholder="Your Email Address" required disabled={loading} />
            </div>

            <div className="input-wrapper text-area-wrapper">
              <textarea name="message" placeholder="Your Message..." rows="6" required disabled={loading} />
            </div>

            {/* DYNAMIC RECAPTCHA COMPONENT */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <ReCAPTCHA
                key={isDark ? 'dark-mode' : 'light-mode'} /* Forces reload on theme change */
                theme={isDark ? 'dark' : 'light'}         /* Sets the visual theme */
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                ref={recaptchaRef}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Sending...' : (
                <>
                  <span>Send Message</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}