import { useState } from 'react';
import ZohoHiddenFields from './ZohoHiddenFields';
import { CLEANUP_TYPE_FIELD_NAME, ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
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

/* The Zoho field the volume/backlog answer is posted to.
 *
 * Empty on purpose: this used to be `SingleLine1`, which the Zoho Forms → CRM
 * integration maps to Lead Source, so every /packages and /books-cleanup lead
 * reached the CRM with a Lead Source of "20 – 80 a month" or "6 – 12 months
 * behind" instead of the ad channel. Set this only to a field name confirmed
 * against the consultation forms' CRM mapping — a wrong name silently
 * overwrites whichever CRM field that Zoho field feeds, with no error anywhere.
 *
 * The answer reaches PostHog either way: the global submit listener in
 * index.html reads it off `select[data-lead-volume]` and attaches it to the
 * `consultation_form_submitted` event. Keep that attribute in sync. */
const VOLUME_FIELD_NAME = '';

/* Which GA4 parameter the form's single select answers.
 *
 * The same control asks a different question per landing page — /packages asks
 * monthly transaction volume, /books-cleanup asks how far behind the books are
 * — so the page names the parameter rather than the component assuming one.
 * Reporting a transaction band as `months_behind` would put a false value in a
 * GA4 property that nothing downstream could tell was false. */
const DEFAULT_SELECT_PARAM = 'monthly_transactions';

const DEFAULT_SELECT_LABEL = 'Approximate monthly transactions';
const DEFAULT_SELECT_HINT = 'A rough number is fine — it tells us which package to quote.';

const PackageQuoteForm = ({
  formId,
  title,
  subtitle,
  submitLabel = 'Get My Quote',
  // /books-cleanup asks for as little as possible before the first submission;
  // the company name is collected in sales follow-up instead. The input stays
  // in the markup either way so Zoho still receives its SingleLine field.
  companyRequired = true,
  // The /books-cleanup intent selected by the card the visitor clicked. Posted
  // only once a spare Zoho field is confirmed (see CLEANUP_TYPE_FIELD_NAME);
  // until then it rides on the data attribute for client-side reporting.
  cleanupType = '',
  // Bing routes pass ZOHO_BING_FORM_ACTION so their leads land in the Bing
  // form's records — see src/utils/zohoForms.js for why the split matters.
  action = ZOHO_GOOGLE_FORM_ACTION,
  // The select stays on the same Zoho field either way; only the question and
  // its options change per landing page (package volume vs. cleanup backlog).
  selectLabel = DEFAULT_SELECT_LABEL,
  selectHint = DEFAULT_SELECT_HINT,
  selectOptions = transactionVolumeBands,
  // Stamped into the CRM's Lead Source field. Pass the ad channel's value from
  // getLeadSourceForChannel() — never the visitor's answer to anything.
  leadSource = '',
  // The `form_name` reported on form_start and form_submit. Pass a stable,
  // human-readable name per placement (e.g. hero_cleanup_quote) — it is what
  // someone reads in GA4 to tell the two forms on a page apart, so changing one
  // splits that form's history in two.
  formName = '',
  selectParam = DEFAULT_SELECT_PARAM,
}) => {
  /* The submission is a native POST that navigates the tab to Zoho, so there is
     a visible dead moment between the click and the page changing. Without
     feedback the visitor clicks again and submits a second lead — which is both
     a duplicate record and a duplicate conversion. The disabled button closes
     both. The confirmed success state is /thank-you, which Zoho only reaches
     after it has accepted the record. */
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={action}
      data-cleanup-type={cleanupType || undefined}
      name="form"
      id={formId}
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      onSubmit={() => setIsSubmitting(true)}
      /* Read by src/components/LeadEventTracker.jsx, which owns form_start and
         the form_submit handoff. Deliberately our own attributes rather than
         Zoho field names: the Zoho names have moved once already and took the
         measurement with them. */
      data-lead-form={formName || formId}
      data-select-param={selectParam}
    >
      <ZohoHiddenFields leadSource={leadSource} />

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
          Business name {companyRequired ? <em>*</em> : null}
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
          required={companyRequired}
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
          name={VOLUME_FIELD_NAME || undefined}
          data-lead-volume=""
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

      {cleanupType && CLEANUP_TYPE_FIELD_NAME ? (
        <input type="hidden" name={CLEANUP_TYPE_FIELD_NAME} value={cleanupType} readOnly />
      ) : null}

      <button type="submit" className="form-submit" disabled={isSubmitting}>
        <em>{isSubmitting ? 'Sending\u2026' : submitLabel}</em>
      </button>

      {isSubmitting ? (
        <p className="form-status" role="status" aria-live="polite">
          Sending your request\u2026 you&rsquo;ll see a confirmation in a moment.
        </p>
      ) : null}
    </form>
  );
};

export default PackageQuoteForm;
