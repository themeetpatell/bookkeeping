import { FiCheckCircle, FiClock, FiStar, FiUsers } from 'react-icons/fi';

// Credential strip pinned under the nav on every marketing page.
//
// AD-POLICY CONSTRAINT — read README before editing this file.
// Google Ads disapproved this destination on 2026-08-11 under the government
// documents & official services policy. The disapproval is keyword-triggered
// and fires on any occurrence in the shipped bundle, so this bar deliberately
// carries NO tax-authority credential — no authority name, agency status or
// registration number, however true it is. The credential in question is real
// (agency registration no. 30022628) and Meet confirmed the correct wording on
// 2026-09-08, but every token in it is on the disapproval keyword list, so it
// belongs on the Webflow site, which is not an ads destination. Keep every item
// here on our own work and on figures already published elsewhere on this site.
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
