import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import './ThankYou.css';

const ThankYou = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-content">
          <div className="success-icon">
            <FiCheckCircle />
          </div>
          
          <h1 className="thank-you-title">Thank You!</h1>
          
          <p className="thank-you-message">
            We've received your submission and our team will get back to you within 24 hours.
          </p>
          
          <div className="next-steps">
            <h2 className="next-steps-title">What Happens Next?</h2>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Review</h3>
                  <p>Our team reviews your information</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Contact</h3>
                  <p>We'll reach out via email or phone</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Consultation</h3>
                  <p>Schedule your free consultation call</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="thank-you-actions">
            <Link to="/" className="btn-home">
              <FiArrowLeft />
              Back to Home
            </Link>
          </div>
          
          <div className="contact-info">
            <p>Need immediate assistance?</p>
            <a href="tel:+971521549572" className="phone-link">+971 52 154 9572</a>
            <a href="mailto:contact@finanshels.com" className="email-link">contact@finanshels.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
