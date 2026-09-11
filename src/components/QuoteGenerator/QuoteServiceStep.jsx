/**
 * Which service the visitor wants priced.
 *
 * Only shown on the generic pages — "/" and the bare accounting forms — where
 * the ad group does not tell us what the visitor came for. A page that sells one
 * thing skips this entirely and goes straight to that service's questions.
 *
 * SINGLE-select, deliberately. FinCore switches to /combo/detect and
 * /combo/resolve the moment more than one service is in play, and this client
 * implements no combo pricing: letting someone tick two would post a total that
 * is simply wrong. The line under the list says so in the visitor's terms rather
 * than hiding it — the rest gets added on the call.
 *
 * @param {{
 *   title: string,
 *   subtitle: string,
 *   services: Array<{ slug: string, chooserLabel: string, chooserHint: string }>,
 *   selectedSlug: string,
 *   onSelect: (service: object) => void,
 * }} props
 */
const QuoteServiceStep = ({ title, subtitle, services, selectedSlug, onSelect }) => (
  <div className="quote-step" data-testid="quote-service">
    <h2 className="quote-question-text">{title || 'What do you need help with?'}</h2>
    {subtitle ? <p className="quote-question-help">{subtitle}</p> : null}

    <div className="quote-options">
      {services.map((service) => (
        <button
          key={service.slug}
          type="button"
          className={`quote-option quote-option-rich${
            selectedSlug === service.slug ? ' is-selected' : ''
          }`}
          onClick={() => onSelect(service)}
          data-testid={`quote-service-${service.slug}`}
        >
          <span className="quote-option-label">{service.chooserLabel}</span>
          {service.chooserHint ? (
            <span className="quote-option-hint">{service.chooserHint}</span>
          ) : null}
        </button>
      ))}
    </div>
  </div>
);

export default QuoteServiceStep;
