import ZohoHiddenFields from './ZohoHiddenFields';
import { ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import { transactionVolumeBands } from '../content/bookkeepingPackages';

/**
 * The short quote form for the /packages landing page.
 *
 * Deliberately short — name, business name, work email, phone and approximate
 * monthly transaction volume — because the ad group sells a priced package, and
 * a quote is the only thing the visitor came for. Every extra field here is a
 * click that already cost money.
 *
 * First and last name share one row so the name costs a single visual row, the
 * same shape the other landing forms use. First name is required because a lead
 * with no name is one sales cannot open a call with; last name stays optional to
 * keep the added friction to one keystroke-length field.
 *
 * Do not rename any `name` attribute or change the action URL — Zoho matches on
 * them, and a renamed field arrives empty with no error to tell you.
 */

/* Zoho's second single-line field. The same answer is also read off the DOM by
   the global submit listener in index.html, which attaches it to the
   `consultation_form_submitted` PostHog event — so the signal survives even if
   this field is not mapped on the Zoho form yet. Keep the name in sync with the
   `select[name="SingleLine1"]` query there. */
const VOLUME_FIELD_NAME = 'SingleLine1';

const DEFAULT_SELECT_LABEL = 'Approximate monthly transactions';
const DEFAULT_SELECT_HINT = 'A rough number is fine — it tells us which package to quote.';

const PackageQuoteForm = ({
  formId,
  title,
  subtitle,
  submitLabel = 'Get My Quote',
  // Bing routes pass ZOHO_BING_FORM_ACTION so their leads land in the Bing
  // form's records — see src/utils/zohoForms.js for why the split matters.
  action = ZOHO_GOOGLE_FORM_ACTION,
  // The select stays on the same Zoho field either way; only the question and
  // its options change per landing page (package volume vs. cleanup backlog).
  selectLabel = DEFAULT_SELECT_LABEL,
  selectHint = DEFAULT_SELECT_HINT,
  selectOptions = transactionVolumeBands,
}) => {
  return (
    <form
      action={action}
      name="form"
      id={formId}
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
    >
      <ZohoHiddenFields />

      <div className="form-header">
        <h2 className="form-title">{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
      </div>

      <div className="form-row form-row-half">
        <div className="form-field">
          <label htmlFor={`${formId}-first-name`}>
            First name <em>*</em>
          </label>
          <input
            id={`${formId}-first-name`}
            type="text"
            name="Name_First"
            fieldType="7"
            maxLength="255"
            placeholder="i.e. John"
            className="form-input"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-last-name`}>Last name</label>
          <input
            id={`${formId}-last-name`}
            type="text"
            name="Name_Last"
            fieldType="7"
            maxLength="255"
            placeholder="i.e. Smith"
            className="form-input"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-company`}>
          Business name <em>*</em>
        </label>
        <input
          id={`${formId}-company`}
          type="text"
          name="SingleLine"
          fieldType="1"
          maxLength="255"
          placeholder="i.e. Dropxcell LLC"
          className="form-input"
          autoComplete="organization"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-email`}>
          Work email <em>*</em>
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          name="Email"
          fieldType="9"
          maxLength="255"
          placeholder="i.e. name@yourdomain.com"
          className="form-input"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-phone`}>
          Phone <em>*</em>
        </label>
        <input
          id={`${formId}-phone`}
          type="tel"
          compname="PhoneNumber"
          name="PhoneNumber_countrycode"
          phoneFormat="1"
          isCountryCodeEnabled="false"
          maxLength="20"
          fieldType="11"
          placeholder="+971 00 000 0000"
          className="form-input"
          autoComplete="tel"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-volume`}>
          {selectLabel} <em>*</em>
        </label>
        <select
          id={`${formId}-volume`}
          name={VOLUME_FIELD_NAME}
          className="form-select pkg-quote-select"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select a range
          </option>
          {selectOptions.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </select>
        <p className="form-hint">{selectHint}</p>
      </div>

      <button type="submit" className="form-submit">
        <em>{submitLabel}</em>
      </button>
    </form>
  );
};

export default PackageQuoteForm;
