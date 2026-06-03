import React, { useRef, useState, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile'; // UPDATED IMPORT
import { Mail, User, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './contact.css';
import './Pages.css';
import Footer from '../components/Footer';

export default function Contact() {
  const formRef = useRef();
  
  // NEW: State to hold the Turnstile token
  const [turnstileToken, setTurnstileToken] = useState(''); 
  const turnstileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isDark, setIsDark] = useState(false);

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

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    // Stop submission if they haven't passed Turnstile
    if (!turnstileToken) {
      setAlert({ type: 'error', message: 'Please complete the security check to prove you are human.' });
      setLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);
    const payload = {
      from_name: formData.get('from_name'),
      from_email: formData.get('from_email'),
      message: formData.get('message'),
      recaptchaToken: turnstileToken // Sent as recaptchaToken so backend doesn't break
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
        setTurnstileToken(''); // Clear token on success
      } else {
        throw new Error(data.error || 'Server rejected the application request.');
      }
    } catch (error) {
      console.error('Submission Backend Error:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Oops! Something went wrong. Please try again.'
      });
      setTurnstileToken(''); // Clear token on error to force re-verification
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
              <input type="text" name="from_name" placeholder="Your Name" autoComplete="name" required disabled={loading} />
            </div>

            <div className="input-wrapper">
              <Mail className="form-icon" size={18} />
              <input type="email" name="from_email" placeholder="Your Email Address" autoComplete="email" required disabled={loading} />
            </div>

            <div className="input-wrapper text-area-wrapper">
              <textarea name="message" placeholder="Your Message..." rows="6" autoComplete="off" required disabled={loading} />
            </div>

            {/* DYNAMIC RECAPTCHA COMPONENT */}
            <div className="turnstile-container">
              <Turnstile
                options={{
                  theme: isDark ? 'dark' : 'light',
                }}
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                ref={turnstileRef}
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