import React,{useEffect} from 'react';
import './Pages.css';
import { FaCheck,FaCode,FaGlobe,FaDatabase,FaTools,FaDownload,FaPhone} from 'react-icons/fa';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope,FaChartBar,FaFilePdf} from 'react-icons/fa';
import { FaHexagonNodes } from 'react-icons/fa6';
import Footer from '../components/Footer';
// 1. Dedicated Home Capsule Sub-Navigation
const HomeSubNav = () => {
  const sections = [
    { label: "About Me", id: "about" },
    { label: "Education", id: "education" },
    { label: "Experience", id: "experience"},
    { label: "Skills", id: "skills" },
    {label:"Certifications",id:"certifications"},
    { label: "Projects", id: "projects" }
  ];

const openPDF = (pdfUrl) => {
  const newWindow = window.open();
  newWindow.opener = null;
  newWindow.location = pdfUrl;
  };

  return (
    <div className="sub-nav-wrapper">
      <div className="glass-capsule-nav">
        {sections.map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              // Direct anchor lookup override
              const element = document.getElementById(item.id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="sub-nav-link"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

  

export default function Home() {
  // Splits the URL to find the true target section id
  useEffect(() => {
    const handleInitialHash = () => {
      const currentHash = window.location.hash;
      if (currentHash) {
        // Clean up patterns like #/skills or #skills down to just "skills"
        const parts = currentHash.split('/');
        const targetId = parts[parts.length - 1].replace('#', '');  
        const element = document.getElementById(targetId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150); // Tiny delay ensures the elements are fully rendered before looking for them
        }
      }
    };

    handleInitialHash();
    window.addEventListener('hashchange', handleInitialHash);
    return () => window.removeEventListener('hashchange', handleInitialHash);
  }, []);


  // const openPDF = (pdfUrl) => {
  // const newWindow = window.open();
  // newWindow.opener = null;
  // newWindow.location = pdfUrl;
  // };


  return (
    <div className="home-root-container">
      {/* 2. Floating Sub-Navigation Bar appears right beneath your global App Header */}
      <HomeSubNav />

      {/* --- HERO SECTION --- */}
      <section id="home" className="hero-section">
        <div className="hero-inner-content">
          <h1>
            Hi, I'm <span className="text-accent">AI Engineer</span>
          </h1>
          <p>
            AI Engineer & Full-Stack Developer specializing in scalable intelligent ecosystems.
          </p>
        </div><br/><br/><br/><br/><br/><br/>

        <div className="hero-buttons">
              <a href="/Mughees_resume.pdf" className="btn" target="_blank" rel="noopener noreferrer">
                <FaDownload /><span style={{marginLeft:'15px'}}> Download Resume</span>
              </a>
              <a href="#contact" className="btn btn-outline"><FaPhone /><span style={{marginLeft:'15px'}}> Contact Me</span></a>
        </div>
      </section>

      {/* --- ABOUT ME SECTION --- */}
      <section id="about" className="content-section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          
          {/* The main card container gets a new class name 'about-card' */}
          <div className="about-card">
      
      {/* Left Column: Text Content */}
      <div className="about-text-content">
        <p>
          I'm a Computer Science graduate specializing in Python backend development (Django/FastAPI) 
          and AI Engineering. I designs scalable architectures, optimizes data pipelines, and deploys production-level LLM 
          solutions using LangChain and LangGraph. With hands-on experience in full-stack development and LLM alignments, 
          I excel at bridging the gap between intelligent AI models and robust web services.</p>
      </div>

      {/* Right Column: Profile Image Container */}
      <div className="about-image-wrapper">
        <img 
          src="\images\portfolio_picture.jpeg" // <-- Replace with your actual image path
          alt="M Mughees Ahmed" 
          className="about-profile-img"
        />
      </div>

    </div>
  </div>
</section>

      {/* --- EDUCATION SECTION --- */}
      <section id="education" className="content-section">
        <h2 className="section-title">Education</h2>
        <div className="education-timeline">
          <div className="glass-card">
            <span className="timeline-date">2021 — 2025</span>
            <h3>Bachelor of Science in Computer Science</h3>
            <p className="institution-name">Bahria University</p>
          </div>
        </div>
      </section>

      <section id="experience" className="content-section">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">Jan 2026 - Present</div>
              <div className="timeline-content">
                <h3>AI Engineer</h3>
                <h4>Techtics.ai</h4>
                <ul>
                  <li>Develop and deploy production-ready AI-driven backends utilizing Python and Django, optimizing system scalability and maintainability.</li>
                  <li>Build and optimize end-to-end web scraping systems and automated pipelines to ingest, clean, and structure massive datasets for downstream AI applications.</li>
                  <li>Orchestrate LLM systems using LangChain and LangGraph, applying strict prompt engineering methods and API integrations to yield robust enterprise features.</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">Aug 2024 - Nov 2024</div>
              <div className="timeline-content">
                <h3>Python Developer Intern</h3>
                <h4>Trigent Inc., Lahore</h4>
                <ul>
                  <li>Built a full-stack quiz app with FastAPI, SQLAlchemy, React, and Tailwind CSS.</li>
                  <li>Added features: collapsible sidebar, dynamic routing, timed quizzes, and real-time feedback.</li>
                  <li>Worked on LLM training with RLHF and SFT for prompt ranking and response evaluation.</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">June 2024 - Aug 2024</div>
              <div className="timeline-content">
                <h3>Website Developer</h3>
                <h4>AMAZETECH, Lahore</h4>
                <ul>
                  <li>Worked on responsive WordPress and Shopify websites.</li>
                  <li>Improved site performance, customized themes, and resolved technical issues.</li>
                  <li>Collaborated in a professional development environment.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/*skill section*/}
      <section id="skills" className="content-section">
        <div className="container">
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3><FaCode/> Programming</h3>
              <ul>
          <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Python</span></li>
          <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Java</span></li>
          <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>C/C++</span></li>
          <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>JavaScript</span></li>
              </ul>
            </div>
            <div className="skill-category">
              <h3><FaGlobe/>Development</h3>
              <ul>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Django Rest</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Django</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>FastAPI</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>React.js</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Node.js</span></li>
                
              </ul>
            </div>
            <div className="skill-category">
              <h3><FaChartBar />Data Analytics</h3>
              <ul>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Pandas</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Numpy</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Matplotlib</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Scikit-learn</span></li>
                
              </ul>
            </div>
            <div className="skill-category">
              <h3><FaHexagonNodes /> LLM & AI Tools</h3>
              <ul>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Prompt Engineering</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Langchain</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Langgraph</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Model Evaluation</span></li>
                
              </ul>
            </div>
            <div className="skill-category">
              <h3><FaDatabase/> Databases</h3>
              <ul>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>MongoDB</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>MySQL</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>PostgreSQL</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>ChromaDB</span></li>
              </ul>
            </div>
            <div className="skill-category">
              <h3><FaTools/>Tool & Platforms</h3>
              <ul>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Git / GitHub</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Github</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Linux</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Postman</span></li>
                <li><FaCheck className="skill-icon"/> <span style={{color:'#94a3b8'}}>Google Colabs</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---certifications section */}
      <section id="certifications" className="content-section">
        <div className="container">
          <h2 className="section-title">Certifications</h2>
          <div className="cert-list">
            <div className="cert-card">
              <div className="skills-badge-flex">
                <span className='skill-badge'>IBM Verified</span>
              </div>
              <h3 className="cert-title">AI Developer</h3>
              <p className="cert-meta">IBM</p>
              <p className="cert-desc">Gained comprehensive hands-on training in core AI architectures, developing conversational bots, and deploying generative AI applications using Python and IBM Watson frameworks.</p>
              
              <div className="cert-links-row">
                <a href={`certs/AI Developer.pdf`} target="_blank" 
                  rel="noopener noreferrer" className="cert-link-item"><FaFilePdf style={{ marginRight: '5px' }} size={14} />
                    View Certificate
                </a>
    
                <a href={`certs/Ai developer.png`} target="_blank" 
                  rel="noopener noreferrer" className="cert-link-item"><FaFilePdf style={{ marginRight: '5px' }} size={14} />
                  View Badge
                </a>
              </div>  
            </div>
            
            <div className="cert-card">
              <div className="skills-badge-flex">
                <span className='skill-badge'>IBM Verified</span>
              </div>
              <h3 className="cert-title">Generative AI-Powered Applications - Python</h3>
              <p className="cert-meta">IBM</p>
              <p className="cert-desc">Learned to architect and deploy generative AI applications, mastering prompt tuning, retrieval models, and API integrations using Python frameworks to build intelligent user experiences.</p>
            
              {/* Left-aligned flex container to keep both links perfectly on one line */}
              <div className="cert-links-row">
                <a href={`certs/Building Generative AI-Powered Applications with Python.pdf`} target="_blank" 
                  rel="noopener noreferrer" className="cert-link-item"><FaFilePdf style={{ marginRight: '5px' }} size={14} />
                    View Certificate
                </a>
    
                <a href={`certs/Building Generative AI-Powered Applications with Python.png`} target="_blank" 
                  rel="noopener noreferrer" className="cert-link-item"><FaFilePdf style={{ marginRight: '5px' }} size={14} />
                  View Badge
                </a>
              </div> 
            </div>

            <div className="cert-card">
              <h3 className="cert-title">Python for AI, Data Science, and Development</h3>
              <p className="cert-meta">IBM</p>
              <p className="cert-desc">Covered data manipulation, structural program logic, and analytical foundations using Python's core data science libraries.</p>
              <a href={`certs/Python for Data Science, AI & Development.pdf`} style={{marginTop:'15px'}} target="_blank" 
                rel="noopener noreferrer" className='cert-link-item' ><FaFilePdf style={{marginRight:'5px'}} size={14}/>
                View Certificate </a>
            </div>
            <div className="cert-card">
              <h3 className="cert-title">Generative AI: Prompt Engineering Basics </h3>
              <p className="cert-meta">IBM</p>
              <p className="cert-desc">Mastered the core principles of prompt engineering, learning how to structure effective prompts, apply context windows, and utilize advanced structuring techniques to optimize LLM outputs.</p>
              <a href={`certs/Generative AI Prompt Engineering Basics.pdf`} style={{marginTop:'15px'}} target="_blank" 
                rel="noopener noreferrer" className='cert-link-item' ><FaFilePdf style={{marginRight:'5px'}} size={14}/>
                View Certificate </a>
            </div>
            <div className="cert-card">
              <h3 className="cert-title">Developing AI-Powered Applications with Python & Flask</h3>
              <p className="cert-meta">IBM</p>
              <p className="cert-desc">Learned to architect and deploy interactive generative AI solutions, mastering Flask server routing, state management, and real-time API integrations with LLMs to build dynamic, data-driven web applications.</p>
              <a href={`certs/Developing AI Applications with Python and Flask.pdf`} style={{marginTop:'15px'}} target="_blank" 
                rel="noopener noreferrer" className='cert-link-item' ><FaFilePdf style={{marginRight:'5px'}} size={14}/>
                View Certificate </a>
            </div>
            <div className="cert-card">
              <h3 className="cert-title">Django Backend Web Development</h3>
              <p className="cert-meta">Codedamn</p>
              <p className="cert-desc">Gained comprehensive hands-on training in constructing robust, data-driven web servers, mastering the Django MVC pattern, ORM database modeling, middleware configuration, and RESTful API deployment.</p>
            </div>
            <div className="cert-card">
              <h3 className="cert-title">Data Visualization</h3>
              <p className="cert-meta">Kaggle</p>
              <p className="cert-desc">Created visual insights using Matplotlib, Seaborn, and data storytelling techniques.</p>
            </div>
            <div className="cert-card">
              <h3 className="cert-title">Introduction to Machine Learning</h3>
              <p className="cert-meta">Google Developers</p>
              <p className="cert-desc">Learned supervised learning, classification, and regression basics.</p>
            </div>
            <div className="cert-card">
              <h3 className="cert-title">Machine Learning Crash Course</h3>
              <p className="cert-meta">Google Developers</p>
              <p className="cert-desc">Hands-on ML with TensorFlow covering neural networks and model evaluation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="content-section project-bottom-padding">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid-layout">
          <div className="glass-card interactive-card">
            <div className="project-tags" >
                <span className='skill-badge' style={{width:'100%',textAlign:'center',marginBottom:'20px'}}>Final Year Project</span>
              </div>
            <h3 className="project-title">Automated HR System</h3>
  
            <p className="project-description"> An AI-powered full-stack platform that processes resume uploads using TF-IDF vectorization and an XGBoost model to mathematically rank candidates. It utilizes a decoupled React and MongoDB stack integrated with high-performance FastAPI microservices. The system also hosts an asynchronous conversational chatbot to fully automate new-hire onboarding operations.</p>
  
            <div className="project-tags">
              <span>XGBoost</span>
              <span>Python</span>
              <span>FastAPI</span>
              <span>MongoDB</span>
              <span>React</span>
            </div>
          </div>

          
          
          <div className="glass-card interactive-card">
            <h3 className="project-title">Contextual Q&A RAG System</h3>
            <p className="project-description">
              An intelligent document search platform utilizing LangChain orchestration, ChromaDB vector storage, and a FastAPI core backend to deliver context-aware answers via a clean web interface.            </p>
            <div className="project-tags">
              <span>Python</span>
              <span>LangChain</span>
              <span>FastAPI</span>
              <span>ChromaDB</span>
              <span>Streamlit</span>
            </div>
          </div>
          <div className="glass-card interactive-card">
            <h3 className="project-title">Portfolio API Backend</h3>
            <p className="project-description">
              A secure REST API built using Django REST Framework featuring custom endpoints, user validation, and comprehensive CORS configurations.
            </p>
            <div className="project-tags">
              <span>Django</span>
              <span>Python</span>
              <span>DRF</span>
              <span>React</span>
            </div>
          </div>
          <div className="glass-card interactive-card">
            <h3 className="project-title">Cafe Management System</h3>
            <p className="project-description">
              A terminal-based management application utilizing custom-built doubly linked list structures to seamlessly simulate operational food menus, billing queues, and live order processing.</p>
            <div className="project-tags">
              <span>C++</span>
              <span>Data Structures</span>
              <span>OOP</span>
            </div>
          </div>
        </div>
        
        
        
      </section>
      
      <Footer />
    </div>
  );
}