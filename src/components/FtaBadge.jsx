import { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

// Credential badge shown above the dashboard preview.
//
// The official mark is NOT bundled with this repo. Drop the file the authority
// supplies at public/fta-logo.png and it renders automatically; until then the
// badge degrades to the check glyph and the wordmark, so a missing asset can
// never ship a broken image to a paid landing page.
//
// AD-POLICY NOTE — see README, TrustBar.jsx and HeroRatingWidget.jsx.
// This badge is the one place on the site that carries the credential, added on
// Meet's explicit instruction after the constraint was put to him three times.
// It puts `fta`, `tax`, `registered` and `registration` into the shipped bundle
// and therefore FAILS the dist/ policy grep by design. That is a deliberate,
// recorded decision, not an oversight.
const LOGO_SRC = '/fta-logo.png';
const AGENCY_NUMBER = '30022628';

const FtaBadge = () => {
  const [hasLogo, setHasLogo] = useState(true);

  return (
    <div className="fta-badge">
      {hasLogo ? (
        <img
          src={LOGO_SRC}
          alt="Federal Tax Authority"
          className="fta-badge-logo"
          onError={() => setHasLogo(false)}
        />
      ) : (
        <FiCheckCircle className="fta-badge-icon" aria-hidden="true" />
      )}
      <span className="fta-badge-copy">
        <strong className="fta-badge-title">FTA Registered Tax Agency</strong>
        <span className="fta-badge-meta">Agency Registration No. {AGENCY_NUMBER}</span>
      </span>
    </div>
  );
};

export default FtaBadge;
