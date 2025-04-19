import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [feedbackForm, showFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ email: "", feedback: "" });
  const API = import.meta.env.REACT_APP_API_URL // if using Vite

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => navigate("/login");
  const handleSignUp = () => navigate("/signUp");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleFeedback=()=>{
    showFeedbackForm(true);
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/feedback`, feedbackData);
      alert("Feedback submitted successfully");
      setFeedbackData({ email: "", feedback: "" });
      showFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };
  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 200);
  };

  return (
    <div className="landing-page-container">
      <div className="background-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>

      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
         
            <div className="logo-icon"><img src="juristiq_icon.jpg" /></div>  
          

          <nav className="main-navigation">
            <a href="#features">Features</a>
            <a href="#feedback" onClick={handleFeedback}>Feedback</a>
          </nav>

          <div className="header-actions">
            <button className="landing-login-button" onClick={handleGetStarted}>Log In</button>
            <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Effortless Legal Case Management</h1>
              <p>Secure, organized, and built specifically for advocates. Streamline your practice with JuristiQ.</p>
              <div className="hero-buttons">
                <button className="cta-button" onClick={(e) => { handleButtonClick(e); handleGetStarted(); }}>
                  Get Started <span className="arrow-icon">→</span>
                </button>
              </div>
            </div>

            <div className="hero-image-container">
              <div className="hero-image">
                <img src="https://www.shutterstock.com/image-photo/law-theme-gavel-mallet-judge-600nw-2478909667.jpg" />
                <div className="image-overlay"></div>
              </div>

              <div className="stats-card">
                <div className="stats-icon">
                  <div className="icon-circle"></div>
                </div>
                <div className="stats-text">
                  <p className="stats-label">Trusted by</p>
                  <p className="stats-description">Legal professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Features for Legal Professionals</h2>
            <p>Everything you need to manage cases, clients, and your practice in one secure platform.</p>
          </div>

          <div className="features-grid">
            {["Case Management", "Fees Management", "Client Portal", "Calendar & Deadlines"].map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <h3>{feature}</h3>
                <p>{`Manage ${feature.toLowerCase()} effectively.`}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to transform your legal practice?</h2>
              <p>Join thousands of legal professionals who trust JuristiQ for their case management needs.</p>
              <div className="cta-buttons">
                <button className="cta-button white" onClick={(e) => { handleButtonClick(e); handleGetStarted(); }}>Get Started</button>
              </div>
            </div>
            <div className="cta-image">
              <img src="dashboard.png" alt="JuristiQ dashboard preview" />
            </div>
          </div>
        </div>
      </section>

       {feedbackForm && (
        <section id="feedback" className="feedback-section">
          <div className="feedback-container">
            <div className="feedback-header">
              <h2>Feedback</h2>
              <p>Help us grow by sharing your feedback. Your opinion counts!</p>
            </div>
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <label>Email</label>
              <input placeholder="Enter your email" type="email" value={feedbackData.email} name="email" onChange={handleInputChange} required />
              <label>Your feedback</label>
              <textarea placeholder="Enter your feedback" value={feedbackData.feed} name="feedback" rows="6" onChange={handleInputChange} required />
              <div className="button-container">
                <button type="submit" className="submit-button">Send</button>
                <button type="button" className="submit-button" onClick={() => showFeedbackForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </section>
      )}
      
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo-container">
            <div className="footer-logo"><img src="juristiq_icon.jpg"/></div>
            
            </div><br/>
            <p className="footer-text">Effortless legal case management—secure, organized, and built for advocates.</p>
          </div>
          <p className="footer-copyright">© {new Date().getFullYear()} JuristiQ. All rights reserved.</p>
          <div className="footer-links">
            <p className="footer-text">Developed by Maanya Gupta & Devyani Sharma</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
