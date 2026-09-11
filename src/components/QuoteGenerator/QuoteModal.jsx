import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import QuoteGenerator from './QuoteGenerator';

/**
 * The dialog the "Generate Quote" CTA opens.
 *
 * Portalled to document.body rather than rendered in place: the site's offer
 * bar, nav and trust bar are all position:fixed with z-index up to 1100, and a
 * modal rendered inside the hero would sit underneath them.
 */
const QuoteModal = ({ isOpen, onClose, planKey = 'accounting' }) => {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocused.current = document.activeElement;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    // The page behind must not scroll while the dialog is open.
    body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      // Send focus back where it came from, or the CTA is lost to keyboard users.
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="quote-modal-backdrop"
      data-testid="quote-modal"
      onClick={(event) => {
        // Only a click on the backdrop itself closes; clicks inside must not.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="quote-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Generate your quote"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          type="button"
          className="quote-modal-close"
          onClick={onClose}
          aria-label="Close quote"
          data-testid="quote-modal-close"
        >
          ×
        </button>
        <div className="quote-modal-body">
          <QuoteGenerator planKey={planKey} onClose={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default QuoteModal;
