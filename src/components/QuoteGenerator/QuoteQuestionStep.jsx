/**
 * One pricing question.
 *
 * Options render as tap targets up to a threshold and as a native select beyond
 * it: "What type of business do you run?" carries 20 options, and twenty cards
 * is a scroll, not a choice. The native control is also the better mobile
 * experience for a long list.
 *
 * @param {{
 *   question: { id: string, text: string, help: string,
 *     options: Array<{ id: string, value: string, text: string }> },
 *   index: number,
 *   total: number,
 *   selectedOptionId: string,
 *   onAnswer: (option: { id: string, value: string, text: string }) => void,
 *   onBack: (() => void) | null,
 * }} props
 */

/* Above this many options a list of buttons stops being scannable. */
const SELECT_THRESHOLD = 10;

const QuoteQuestionStep = ({ question, index, total, selectedOptionId, onAnswer, onBack }) => {
  const useSelect = question.options.length > SELECT_THRESHOLD;

  return (
    <div className="quote-step" data-testid="quote-question">
      <div className="quote-progress">
        <span className="quote-progress-label">
          Question {index + 1} of {total}
        </span>
        <span className="quote-progress-track" aria-hidden="true">
          <span
            className="quote-progress-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </span>
      </div>

      <h2 className="quote-question-text">{question.text}</h2>
      {question.help ? <p className="quote-question-help">{question.help}</p> : null}

      {useSelect ? (
        <select
          className="quote-select"
          value={selectedOptionId || ''}
          onChange={(event) => {
            const option = question.options.find((o) => o.id === event.target.value);
            if (option) onAnswer(option);
          }}
          aria-label={question.text}
        >
          <option value="" disabled>
            Select an option
          </option>
          {question.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.text}
            </option>
          ))}
        </select>
      ) : (
        <div className="quote-options">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`quote-option${selectedOptionId === option.id ? ' is-selected' : ''}`}
              onClick={() => onAnswer(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      {onBack ? (
        <button type="button" className="quote-back" onClick={onBack}>
          ← Back
        </button>
      ) : null}
    </div>
  );
};

export default QuoteQuestionStep;
