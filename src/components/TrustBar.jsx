import { FiCheckCircle, FiClock, FiStar, FiUsers } from 'react-icons/fi';

// Credential strip pinned under the nav on every marketing page.
//
// Each figure below is stated on the landing pages already:
//   7,000+ businesses  — hero trust badge + stats row on every landing page
//   4.9 / 239 reviews  — Trustpilot block, 8 pages
//   48 hours           — onboarding/handover promise, hero + offer bar
//   dedicated team     — hero description on the bookkeeping landing
const TRUST_ITEMS = [
  { Icon: FiUsers, label: 'Trusted by 7,000+ UAE businesses' },
  { Icon: FiStar, label: '4.9/5 on Trustpilot · 239 reviews' },
  { Icon: FiClock, label: 'Books handed over in 48 hours' },
  { Icon: FiCheckCircle, label: 'Dedicated UAE accounting team' },
];

const TrustBar = () => (
  <div className="trust-bar" role="region" aria-label="Why businesses choose us">
    <div className="trust-bar-inner">
      {TRUST_ITEMS.map((item, index) => (
        <div className="trust-bar-item" key={item.label}>
          {index > 0 && <span className="trust-bar-sep" aria-hidden="true" />}
          <item.Icon className="trust-bar-icon" aria-hidden="true" />
          <span className="trust-bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TrustBar;
