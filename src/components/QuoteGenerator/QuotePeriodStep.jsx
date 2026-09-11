import { useState } from 'react';
import { isValidPeriodRange } from '../../lib/quoteApi';

/**
 * The window a retrospective service covers.
 *
 * Only shown for a `date_range` service — today that is Prior-Period Catch-Up &
 * Books Cleanup. It is a real control rather than a default because the window
 * IS the thing being bought: the backlog. None of the pricing questions
 * establish duration (they ask transaction count and total value), so there is
 * nothing to infer it from, and a guessed range would put a scope on the
 * proposal that nobody agreed to.
 *
 * FinCore requires both ends and validates that the end is after the start. It
 * enforces that when the proposal is saved — the very last step, after every
 * question has been answered — so the same rule is enforced here, where the
 * visitor can still fix it.
 *
 * @param {{
 *   instruction: string,
 *   index: number,
 *   total: number,
 *   value: { periodStart: string, periodEnd: string },
 *   onSubmit: (period: { periodStart: string, periodEnd: string }) => void,
 *   onBack: (() => void) | null,
 * }} props
 */
const QuotePeriodStep = ({ instruction, index, total, value, onSubmit, onBack }) => {
  const [periodStart, setPeriodStart] = useState(value?.periodStart || '');
  const [periodEnd, setPeriodEnd] = useState(value?.periodEnd || '');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!periodStart || !periodEnd) {
      setError('Tell us the first and last month you need covered.');
      return;
    }
    if (!isValidPeriodRange(periodStart, periodEnd)) {
      setError('The last month has to come after the first one.');
      return;
    }
    setError('');
    onSubmit({ periodStart, periodEnd });
  };

  return (
    <form className="quote-step" onSubmit={submit} data-testid="quote-period" noValidate>
      <div className="quote-progress">
        <span className="quote-progress-label">
          Question {index + 1} of {total}
        </span>
        <span className="quote-progress-track" aria-hidden="true">
          <span className="quote-progress-fill" style={{ width: '100%' }} />
        </span>
      </div>

      <h2 className="quote-question-text">
        {instruction || 'What period do you need the books cleaned up for?'}
      </h2>
      <p className="quote-question-help">
        The months your books are behind. Your advisor can adjust this on the call.
      </p>

      <div className="quote-field-row">
        <div className="quote-field">
          <label htmlFor="quote-period-start">First month</label>
          <input
            id="quote-period-start"
            name="periodStart"
            type="month"
            className="quote-input"
            value={periodStart}
            onChange={(event) => setPeriodStart(event.target.value)}
          />
        </div>
        <div className="quote-field">
          <label htmlFor="quote-period-end">Last month</label>
          <input
            id="quote-period-end"
            name="periodEnd"
            type="month"
            className="quote-input"
            value={periodEnd}
            onChange={(event) => setPeriodEnd(event.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p className="quote-field-error" data-testid="quote-period-error">
          {error}
        </p>
      ) : null}

      <button type="submit" className="quote-submit">
        See my price →
      </button>

      {onBack ? (
        <button type="button" className="quote-back" onClick={onBack}>
          ← Back
        </button>
      ) : null}
    </form>
  );
};

export default QuotePeriodStep;
