import ZohoHiddenFields from './ZohoHiddenFields';
import { ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import { transactionVolumeBands } from '../content/bookkeepingPackages';

/**
 * The short quote form for the /packages landing page.
 *
 * Deliberately four visible fields — business name, work email, phone and
 * approximate monthly transaction volume — because the ad group sells a priced
 * package, and a quote is the only thing the visitor came for. Every extra
 * field here is a click that already cost money.
 *
 * The name inputs are hidden rather than removed: the Zoho form treats them as
 * optional, and submitting them empty is exactly what happens today when a
 * visitor skips them on the other landing pages. Dropping them from the payload
 * entirely would be an untested change to a form carrying live ad spend.
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

const PackageQuoteForm = ({ formId, title, subtitle, submitLabel = 'Get My Quote' }) => {
  return (
    <form
      action={ZOHO_GOOGLE_FORM_ACTION}
      name="form"
      id={formId}
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
    >
      <ZohoHiddenFields />
      <input type="hidden" name="Name_First" value="" readOnly />
      <input type="hidden" name="Name_Last" value="" readOnly />

      <div className="form-header">
        <h2 className="form-title">{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
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
          Approximate monthly transactions <em>*</em>
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
          {transactionVolumeBands.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </select>
        <p className="form-hint">
          A rough number is fine — it tells us which package to quote.
        </p>
      </div>

      <button type="submit" className="form-submit">
        <em>{submitLabel}</em>
      </button>
    </form>
  );
};

export default PackageQuoteForm;
