import { FiStar } from 'react-icons/fi';

// Floating review card for the hero, sat directly above the hero stat row.
//
// Both figures are already published on this site — the Trustpilot block on
// AccountingLanding.jsx and seven sibling pages states 4.9/5 from 239 reviews.
const RATING = '4.9';
const REVIEW_COUNT = '239';
const STAR_COUNT = 5;

const HeroRatingWidget = () => (
  <div
    className="hero-rating-card"
    role="img"
    aria-label={`Rated ${RATING} out of 5 from ${REVIEW_COUNT} reviews on Trustpilot`}
  >
    <span className="hero-rating-score">{RATING}</span>
    <span className="hero-rating-divider" aria-hidden="true" />
    <span className="hero-rating-body">
      <span className="hero-rating-stars" aria-hidden="true">
        {Array.from({ length: STAR_COUNT }, (_, i) => (
          <FiStar key={i} className="hero-rating-star" />
        ))}
      </span>
      <span className="hero-rating-meta" aria-hidden="true">
        <strong>{RATING}/5</strong> from {REVIEW_COUNT} reviews on Trustpilot
      </span>
    </span>
  </div>
);

export default HeroRatingWidget;
