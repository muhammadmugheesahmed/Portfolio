import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, User, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './contact.css';
import './Pages.css';
import Footer from '../components/Footer';

export default function Contact() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    // Safely pulling variables from your local .env file
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(serviceID, templateID, formRef.current, publicKey)
      .then(() => {
        setAlert({
          type: 'success',
          message: 'Message sent successfully! Check your Email inbox for a confirmation.'
        });
        formRef.current.reset(); // Clear input fields completely
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setAlert({
          type: 'error',
          message: 'Oops! Something went wrong. Please try again or reach out directly via email.'
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
              <input 
                type="text" 
                name="from_name"  /* Match this identifier exactly inside your EmailJS Template */
                placeholder="Your Name" 
                required 
                disabled={loading}
              />
            </div>

            <div className="input-wrapper">
              <Mail className="form-icon" size={18} />
              <input 
                type="email" 
                name="from_email"   /* Match this identifier exactly inside your EmailJS Template */
                placeholder="Your Email Address" 
                required 
                disabled={loading}
              />
            </div>

            <div className="input-wrapper text-area-wrapper">
              <textarea 
                name="message"    /* Match this identifier exactly inside your EmailJS Template */
                placeholder="Your Message..." 
                rows="6" 
                required 
                disabled={loading}
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