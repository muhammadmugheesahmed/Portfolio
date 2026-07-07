import React, { useState } from 'react';
import './projects.css';
import { FaGithub} from 'react-icons/fa';



const ProjectsSection = () => {
  // 1. Store projects in an array for easy iteration
  const projectData = [
    {
      image: import.meta.env.BASE_URL + '/assets/automated-hr.avif',
      title: "Automated HR System",
      url: "https://github.com/muhammadmugheesahmed/Automated-HR-System.git",
      badge: "Final Year Project",
      description: "An AI-powered full-stack platform that processes resume uploads using TF-IDF vectorization and an XGBoost model to mathematically rank candidates. It utilizes a decoupled React and MongoDB stack integrated with high-performance FastAPI microservices. The system also hosts an asynchronous conversational chatbot to fully automate new-hire onboarding operations.",
      tags: ["XGBoost", "Python", "FastAPI", "MongoDB", "React"]
    },
    {
      image: import.meta.env.BASE_URL + '/assets/context-flow.png',
      title: "Context Flow",
      url: "https://github.com/muhammadmugheesahmed/Context-Flow.git",
      description: "A full-stack RAG (Retrieval-Augmented Generation) application that allows you to chat with your documents. Upload your files, and the application will build a knowledge base that a powerful language model (Google's Gemini) can use to answer your questions with context-aware responses.",
      tags: ["Python", "React", "LangChain", "FastAPI", "ChromaDB", "Google Gemini API"]
    },
    {
      title: "Personal Portfolio",
      image: import.meta.env.BASE_URL + '/assets/portfolio.webp',
      url: "https://github.com/muhammadmugheesahmed/react-portfolio.git",
      description: "A secure REST API built using Django REST Framework featuring custom endpoints, user validation, and comprehensive CORS configurations. Email Configuration on Contact Us with real-time Recommendations.",
      tags: ["Django", "Python", "DRF", "React","Supabase","Netlify"]
    },

  ];

  // 2. Track the active project index
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Navigation logic with built-in looping
  // --- Touch Swipe State ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; // Minimum distance (in px) to register a swipe

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectData.length);
  };

  const prevProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projectData.length) % projectData.length);
  };

  // --- Touch Event Handlers ---
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end to avoid false positives
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextProject(); // Swipe left goes to next
    } else if (isRightSwipe) {
      prevProject(); // Swipe right goes to previous
    }
  };


  const currentProject = projectData[currentIndex];

  return (
    <section id="projects" className="content-section project-bottom-padding">
      <h2 className="section-title">Featured Projects</h2>
      
      <div className="carousel-container">
        
        <button onClick={prevProject} className="carousel-arrow"
          aria-label="Previous Project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Active Project Card - Landscape Mode */}
        <div className="glass-card interactive-card stacked-card project-card-main">
          
          {currentProject.badge && (
            <div className="project-tags">
              <span className='skill-badge project-badge'>
                {currentProject.badge}
              </span>
            </div>
          )}
          
          {currentProject.image && (
            <div className="project-image-container">
               <img 
               className="project-image" 
               src={currentProject.image} 
               alt={currentProject.title} 
               />
            </div>
        )}

        <div className="project-content">
          <h3 className="project-title">{currentProject.title}</h3>
          
          <p className="project-description">{currentProject.description}</p>
          <p className="project-links" ><FaGithub />  <a href={currentProject.url} rel="noopener noreferrer" target="_blank"> <span>View on GitHub</span></a></p>

          <div className="project-tags project-tags-bottom">

            {currentProject.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>
        </div>

        <button onClick={nextProject} className="carousel-arrow"
          aria-label="Next Project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

      </div>
      
      {/* Optional: Indicator dots to show position in loop */}
      <div className="carousel-dots">
        {projectData.map((_, index) => (
          <div 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;