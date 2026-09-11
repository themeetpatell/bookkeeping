import { formatAed, proposalUrlFor } from '../../lib/quoteApi';

/**
 * The price, and what happens next.
 *
 * Every question is answered before this screen, and every answer is stored on
 * the proposal's pathSnapshot — including the ones that do not move the price.
 * Those are the advisor's best qualifying signal, and an answer collected after
 * the proposal was created would never have reached them.
 *
 * The figure is framed as an estimate on purpose. It is a real resolved price
 * from the live catalog, but it is computed from the questions we ask and
 * assumes the ones we skip, so presenting it as binding would be a promise the
 * advisor has to walk back on the call.
 *
 * The proposal reference is shown when FinCore accepted the record — that is
 * what the proposal engine turns into a qualified deal, and it is the visitor's
 * proof that something real happened.
 */
const QuoteResultStep = ({ price, proposal, answerCount, whatsAppHref }) => {
  /* A one-time service is bought once, not per month. Cleanup, VAT registration
     and Corporate Tax registration all come back as `one_time`, and rendering
     "AED 999/month" against one of those would quote twelve times the price on a
     paid landing page. FinCore returns the whole fee in priceMonthly for these —
     it is the line's amount, not a rate. */
  const isOneTime = price.billingBucket === 'one_time';
  const isQuarterly = !isOneTime && price.billingFrequency === 'quarterly';

  return (
    <div className="quote-step quote-result" data-testid="quote-result">
      <p className="quote-result-label">Your estimated price</p>

      {price.isCustomQuote ? (
        <>
          <p className="quote-result-amount quote-result-custom">Custom quote</p>
          <p className="quote-result-note">
            Your setup needs a specialist to price properly. An advisor will call you with a
            figure within one business day.
          </p>
        </>
      ) : (
        <>
          <p className="quote-result-amount">
            {formatAed(price.priceMonthly)}
            <span className="quote-result-period">{isOneTime ? ' one-off' : '/month'}</span>
          </p>
          {isQuarterly ? (
            <p className="quote-result-note">
              Billed quarterly at {formatAed(price.priceQuarterly ?? price.priceMonthly * 3)}.
            </p>
          ) : null}
        </>
      )}

      <p className="quote-result-basis">
        Based on the {answerCount} answers you gave. Your advisor confirms the final figure on the call —
        nothing is charged until you approve a proposal.
      </p>

      <div className="quote-result-next">
        {proposal ? (
          <>
            <p className="quote-result-next-text">
              Saved as proposal <strong>{proposal.quoteNumber}</strong>. Open it to see the full
              scope, and pay online whenever you&rsquo;re ready — or an advisor will call within one
              business day.
            </p>
            {/* The reason the proposal is created at all rather than just a
                price being shown: from here the customer can read the scope,
                pay by card and sign the engagement letter without waiting for
                anyone. New tab so the landing page — and its ad session —
                survives. */}
            <a
              className="quote-proposal-cta"
              href={proposalUrlFor(proposal.publicToken)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="quote-proposal-link"
            >
              Open your proposal →
            </a>
          </>
        ) : (
          /* The proposal did not save. Promising a callback here would be a
             promise nothing can keep — there is no record to call from. */
          <>
            <p className="quote-result-next-text">
              We couldn&rsquo;t save this quote automatically. Send it to us on WhatsApp and
              we&rsquo;ll pick it up straight away.
            </p>
          </>
        )}
        {/* Secondary once a proposal exists — the proposal is the better next
            step. Primary when it does not, because then talking to us is the
            only way this lead survives. */}
        <a
          className={proposal ? 'quote-whatsapp-secondary' : 'quote-whatsapp'}
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {proposal ? 'Or ask us a question on WhatsApp' : 'Talk to us on WhatsApp'}
        </a>
      </div>
    </div>
  );
};

export default QuoteResultStep;
