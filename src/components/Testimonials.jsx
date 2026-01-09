import { useRef, useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    quote:
      'Fast, friendly, and very professional. I love how communicative they were handling our Corporate tax registration.',
    name: 'Abdulla Al-Ogail',
    title: 'Co-founder & CEO, Olymon',
    avatar: '/Founders/abdulla.jpeg',
  },
  {
    quote:
      'Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving. Very happy that I took the decision to work with them.',
    name: 'Szilvia Vitos',
    title: 'Founder, Livvity',
    avatar: '/Founders/szilvia.jpeg',
  },
  {
    quote:
      'They designed an accounting system tailor made to our needs & completely automated our finance operations just like they promised. They\'ve been super helpful for us to scale.',
    name: 'Jeremy Khatar',
    title: 'CEO, Ronin Global LLC, USA',
    avatar: '/Founders/jeremy.png',
  },
  {
    quote: 'If you ever do any financial modeling/forecasting, I seriously can\'t recommend Finanshels enough. they are a dependable team of professionals who work hard to deliver results.',
    name: 'Bader Al Kazimi',
    title: 'Founder, Optimize App',
    avatar: '/Founders/bader.jpeg',
  },
  {
    quote: 'I am extremely grateful for the exceptional service we received from Finanshels.com. We insurancehub.ae highly recommend their services to anyone seeking reliable and trustworthy Accounting Partner.',
    name: 'Jomon Ulahannan',
    title: 'Founder & CEO, INSURANCE HUB',
    avatar: '/Founders/jomon.jpg',
  },
  {
    quote: 'Super fast team and I can always depend on these guys...way to go',
    name: 'Pravin Rai',
    title: 'Founder & CEO, QuicKart',
    avatar: '/Founders/pravin.jpeg',
  },
  {
    quote: 'Bookkeeping, a piece of cake with Finanshels! Sahal has been extremely helpful in managing the books! He makes sure its up-to-date and super clean! Sometimes, for advice, I refer to him as well and again, he has been super supportive and helpful to my needs!',
    name: 'Sapna Mulani',
    title: 'Sr Accountant, Growdash',
    avatar: '/Founders/sapna.jpg',
  },
  {
    quote: 'They thoroughly understood our business processes and streamlined our accounting processes perfectly where our both in-house and outsourced accountants failed multiple times to streamline and structure our complex financial ops.',
    name: 'Meet Patel',
    title: 'Former COO, StudentHub & BAWES',
    avatar: '/Founders/themeetpatel.png',
  },
  {
    quote: 'Excellent service. Finanshels has made the tax registration process fast and easy. Their communication is super prompt and clear. 5 stars!!',
    name: 'Tina Chugani',
    title: 'Managing Director, Proxis LLC',
    avatar: '/Founders/tina.jpeg',
  },

  {
    quote: 'The team was super responsive and the entire service was efficiently processed.',
    name: 'Usama Naeem',
    title: 'Co-founder, Qureos',
    avatar: '/Founders/usama.jpeg',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialGroups = [];
  
  // Group testimonials into sets of 3
  for (let i = 0; i < testimonials.length; i += 3) {
    testimonialGroups.push(testimonials.slice(i, i + 3));
  }

  const avatarStyle = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  };

  const avatarFallbackStyle = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f16610',
    color: '#fff',
    fontWeight: 700,
    textTransform: 'uppercase',
    flexShrink: 0,
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('');

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialGroups.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonialGroups.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-vb">
      <div className="testimonials-header">
        <p className="section-eyebrow">Client Success Stories</p>
        <h2 className="section-title">
          Trusted by <span className="highlight-orange">5,000+ Businesses</span>
        </h2>
        <p className="section-subtitle">Hear what founders say about working with Finanshels.</p>
      </div>

      <div className="testimonials-shell">
        <button
          type="button"
          className="testimonial-nav nav-left"
          aria-label="Previous testimonials"
          onClick={handlePrevious}
        >
          <FiChevronLeft />
        </button>
        <button
          type="button"
          className="testimonial-nav nav-right"
          aria-label="Next testimonials"
          onClick={handleNext}
        >
          <FiChevronRight />
        </button>

        <div className="testimonials-rail">
          {testimonialGroups[currentIndex]?.map((t) => (
            <div key={t.name} className="testimonial-card-vb">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="star-icon" fill="#f16610" stroke="#f16610" />
                ))}
              </div>
              <div className="quote-mark">❝</div>
              <p className="testimonial-quote-vb">"{t.quote}"</p>
              <div className="testimonial-footer-vb">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} style={avatarStyle} loading="lazy" />
                ) : (
                  <div style={avatarFallbackStyle}>{getInitials(t.name)}</div>
                )}
                <div>
                  <div className="author-name-vb">{t.name}</div>
                  <div className="author-role-vb">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-footer">
        <div className="rating-chip">
          <div className="rating-stars-display">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} fill="#f16610" stroke="#f16610" />
            ))}
          </div>
          <span className="rating-score">4.9/5 on Trustpilot</span>
          <span className="review-count">Based on 239 reviews</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
