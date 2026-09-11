import { useEffect, useState } from 'react';
import { usePostHog } from '@posthog/react';
import QuoteModal from './QuoteModal';

/* Opens the dialog straight from the URL: /bookkeeping?quote=open
   Two uses, both real. QA and preview — someone has to be able to open this on
   a live page, on a real phone, without clicking through the hero first. And
   deep-linking — an ad or an email can land a visitor directly in the quote
   instead of asking them to find the button. Only the first CTA on a page
   honours it, so two CTAs cannot open two dialogs. */
const AUTO_OPEN_PARAM = 'quote';
const AUTO_OPEN_VALUE = 'open';

const shouldAutoOpen = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get(AUTO_OPEN_PARAM) === AUTO_OPEN_VALUE;
};

/**
 * A "Generate Quote" call to action and the dialog it opens.
 *
 * Self-contained so a page can drop it wherever a booking CTA used to sit
 * without wiring modal state of its own. The page's lead forms are untouched —
 * this is an additional path to a price, not a replacement for them.
 *
 * @param {{ label?: string, className?: string, planKey?: string,
 *   location?: string }} props `location` names the placement in analytics, so
 *   two CTAs on one page stay tellable apart.
 */
const QuoteCta = ({
  label = 'Generate Quote →',
  className = 'btn-primary',
  planKey = 'accounting',
  location = 'untagged',
  autoOpen = false,
}) => {
  /* Read at first render rather than in an effect: the URL is already known, so
     opening from state avoids a second render pass that would flash the page
     before the dialog appears. */
  const [isOpen, setIsOpen] = useState(() => autoOpen && shouldAutoOpen());
  const posthog = usePostHog();

  // Reporting only — the dialog is already open by the time this runs.
  useEffect(() => {
    if (!isOpen || !autoOpen) return;
    posthog?.capture?.('quote_cta_clicked', { location, plan: planKey, trigger: 'url' });
    // Intentionally mount-only: a click-opened dialog reports from `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = () => {
    setIsOpen(true);
    posthog?.capture?.('quote_cta_clicked', { location, plan: planKey, trigger: 'click' });
  };

  return (
    <>
      <button type="button" className={className} onClick={open} data-testid={`quote-cta-${location}`}>
        {label}
      </button>
      <QuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} planKey={planKey} />
    </>
  );
};

export default QuoteCta;
