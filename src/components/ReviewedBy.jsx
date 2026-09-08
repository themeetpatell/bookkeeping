import { useState } from 'react';

// "Reviewed by" attribution for a landing page's claims.
//
// Deliberately a named, credentialed person with a real photograph. An unnamed
// "expert" or a stock portrait reads as manufactured authority and is worse
// than no attribution at all.
//
// Both the photo and the profile link degrade rather than break: a missing
// image falls back to initials, and the link is simply not rendered until a
// cleared destination exists. See cleanupReviewer in src/content/booksCleanup.js
// for why profileUrl is empty.
const getInitials = (name) =>
  name
    .replace(/,.*$/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const ReviewedBy = ({ name, role, photo, profileUrl = '' }) => {
  const [hasPhoto, setHasPhoto] = useState(Boolean(photo));

  return (
    <aside className="reviewed-by" aria-label="Who reviewed this page">
      {hasPhoto ? (
        <img
          src={photo}
          alt={name}
          className="reviewed-by-photo"
          width="56"
          height="56"
          loading="lazy"
          decoding="async"
          onError={() => setHasPhoto(false)}
        />
      ) : (
        <span className="reviewed-by-initials" aria-hidden="true">
          {getInitials(name)}
        </span>
      )}

      <span className="reviewed-by-copy">
        <span className="reviewed-by-label">Reviewed by</span>
        <strong className="reviewed-by-name">{name}</strong>
        <span className="reviewed-by-role">{role}</span>
        {profileUrl ? (
          <a className="reviewed-by-link" href={profileUrl} rel="nofollow noreferrer">
            View verified profile
          </a>
        ) : null}
      </span>
    </aside>
  );
};

export default ReviewedBy;
