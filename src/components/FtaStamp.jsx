import { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

/* The credential applied to the corner of a lead form, the way a seal is
   applied to a signed document.
 *
 * Distinct from FtaBadge, which is the horizontal card that sits under a CTA in
 * the hero copy column. This one is absolutely positioned and belongs INSIDE a
 * form card — every container it is dropped into is given `position: relative`
 * in App.css, so adding it to a new form means adding that class there too or
 * the stamp escapes to the nearest positioned ancestor.
 *
 * Same asset and fallback contract as FtaBadge: the official mark ships at
 * public/fta-logo.png, and a missing file degrades to the check glyph rather
 * than a broken image on a paid landing page. */
const LOGO_SRC = '/fta-logo.png';
const AGENCY_NUMBER = '30022628';

const FtaStamp = () => {
  const [hasLogo, setHasLogo] = useState(true);

  return (
    <div
      className="fta-stamp"
      role="img"
      aria-label={`FTA Registered Tax Agency, agency registration number ${AGENCY_NUMBER}`}
    >
      {hasLogo ? (
        <img
          src={LOGO_SRC}
          alt=""
          className="fta-stamp-logo"
          onError={() => setHasLogo(false)}
        />
      ) : (
        <FiCheckCircle className="fta-stamp-icon" aria-hidden="true" />
      )}
      <span className="fta-stamp-title" aria-hidden="true">
        Registered Tax Agency
      </span>
      <span className="fta-stamp-no" aria-hidden="true">
        No. {AGENCY_NUMBER}
      </span>
    </div>
  );
};

export default FtaStamp;
