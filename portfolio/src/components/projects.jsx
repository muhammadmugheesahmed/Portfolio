import React from 'react';
import './projects.css';
import { FaGithub} from 'react-icons/fa';

// 1. Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// 2. Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// 3. Import Swiper modules
import { Navigation, Pagination, A11y } from 'swiper/modules';

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

const ProjectsSection = () => {
  return (
    <section id="projects" className="content-section project-bottom-padding">
      <h2 className="section-title">Featured Projects</h2>

      <div className="carousel-container">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          autoHeight={true} /* FIX 2: Adapts pagination to varying card lengths */
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ 
            el: '.swiper-pagination',
            clickable: true 
          }}
          grabCursor={true}
          loop={true}
          className="mySwiper"
          breakpoints={{
            /* FIX 4: Swiping works on mobile, but disables dragging on desktops (relies on arrows) */
            0: {
              allowTouchMove: true, 
            },
            768: {
              allowTouchMove: false, 
            }
          }}
        >
          {projectData.map((project, index) => (
            <SwiperSlide key={index}>
              <div className="carousel-slide-content">
                <div className="glass-card interactive-card stacked-card project-card-main">
                  {project.badge && (
                    <div className="project-tags">
                      <span className='skill-badge project-badge'>
                        {project.badge}
                      </span>
                    </div>
                  )}

                  {project.image && (
                    <div className="project-image-container">
                      <img
                        className="project-image"
                        src={project.image}
                        alt={project.title}
                      />
                    </div>
                  )}

                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <p className="project-links">
                      <FaGithub />
                      <a href={project.url} rel="noopener noreferrer" target="_blank">
                        <span>View on GitHub</span>
                      </a>
                    </p>

                    <div className="project-tags project-tags-bottom">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev carousel-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          </div>
          <div className="swiper-button-next carousel-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
          </div>
          
          {/* Custom Pagination Container */}
          
          <div className="swiper-pagination"></div>
        </Swiper>

      </div>

    </section>
  );
};

export default ProjectsSection;