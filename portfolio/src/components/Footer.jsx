import React from 'react';
import {FaPhone, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import {Link} from 'react-router-dom';
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container footer-container">
        <div className="footer-info">
          <p>&copy; {currentYear} Muhammad Mughees Ahmed. All rights reserved.</p>
        </div>

        <ul className="footer-links">
          <li><Link to="/#home">Home</Link></li>
          <li><Link to='/recommendations'>Recommendations</Link></li>
          <li><Link to='/#skills'>Skills</Link></li>
          <li><Link to='/contact'>Contact</Link></li>
        </ul>

        <div className="footer-socials">
            <a href="tel:+92-335-4152706" aria-label="Phone"><FaPhone size={17}/>
          </a>
          <a href="https://github.com/muhammadmugheesahmed" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/mughees-ahmed-feb2003" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="mailto:mugheesahmad39@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
          
        </div>
      </div>
    </footer>
  );
}
