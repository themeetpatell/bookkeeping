import { useState } from 'react';
import ZohoHiddenFields from './ZohoHiddenFields';
import { ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import { transactionVolumeBands } from '../content/bookkeepingPackages';

/**
 * The lead form for the /bookkeeping landing page.
 *
 * Opens with three fields and nothing else: one contact channel, approximate
 * monthly transaction volume, and the software already in use. That is the
 * shortest set that still lets sales quote a plan rather than book a generic
 * call, and the reason for the split is the first screen — a visitor prices the
 * cost of the form before typing anything, so every field visible at rest is
 * paid for out of the form-start rate.
 *
 * It is a TWO-step form rather than a three-field one on purpose. The Zoho CRM
 * mandates a phone number on every lead record, so a single "work email or UAE
 * mobile" field would let a lead in with no phone — a record sales cannot work,
 * which converts a measured form completion into nothing. Whichever channel the
 * visitor did not give in step one is collected in step two alongside a name,
 * and nothing is posted to Zoho until both are present.
 *
 * Do not rename any `name` attribute or change the action URL — Zoho matches on
 * them, and a renamed field arrives empty with no error to tell you.
 */

/* The software the UAE small businesses in this ad group actually run on. The
   answer routes the lead: an existing ledger is a migration, a spreadsheet is a
   build from scratch, and the two are not the same first call. */
const accountingSoftwareOptions = [
  'Zoho Books',
  'Xero',
  'QuickBooks',
  'Tally',
  'Excel or Google Sheets',
  'Nothing yet',
  'Something else',
];

/* Neither select carries a `name`, so neither is posted to Zoho.
 *
 * Same reason VOLUME_FIELD_NAME and CLEANUP_TYPE_FIELD_NAME are empty in
 * src/utils/zohoForms.js: a Zoho field name that the Forms -> CRM integration
 * maps to something silently overwrites whichever CRM field it feeds, with no
 * error raised anywhere. That has already happened on this site — the quote
 * form's volume answer posted into the field the CRM reads Lead Source from,
 * and every lead in that ad group arrived with a Lead Source of "20 - 80 a
 * month" instead of the ad channel.
 *
 * Both answers still reach GA4 and PostHog, off the `data-lead-volume` and
 * `data-software` attributes that readFormParams() in src/utils/leadTracking.js
 * already looks for. Give either select a `name` only once a spare Zoho field
 * has been confirmed against the live form's CRM mapping. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* An "@" is what the visitor meant, not what validates — someone typing an
   address gets the email error rather than being told their mobile is wrong. */
const looksLikeEmail = (value) => value.includes('@');

/* Deliberately loose. A UAE mobile arrives as 050…, 00971…, +971… or with
   spaces and dashes, and a strict pattern rejects a real number far more often
   than it catches a fake one — which costs a lead to save a validation. */
const isPlausibleMobile = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
};

const BookkeepingPlanForm = ({
  formId,
  title = 'Get My Bookkeeping Plan',
  subtitle = 'Three questions. We come back with the plan and the monthly price for your volume.',
  submitLabel = 'Get My Bookkeeping Plan',
}) => {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState('');
  const [volume, setVolume] = useState('');
  const [software, setSoftware] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  /* The submission is a native POST that navigates the tab to Zoho, so there is
     a visible dead moment between the click and the page changing. Without
     feedback the visitor clicks again and files a second lead — a duplicate
     record and a duplicate conversion. The confirmed success state is
     /thank-you, which Zoho only reaches after it has accepted the record. */
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onStepOne = step === 1;
  const contactIsEmail = looksLikeEmail(contact);

  const openStepTwo = () => {
    const trimmed = contact.trim();

    if (!trimmed) {
      setError('Enter a work email or a UAE mobile number.');
      return;
    }
    if (contactIsEmail && !EMAIL_PATTERN.test(trimmed)) {
      setError('That email address does not look complete — check it and try again.');
      return;
    }
    if (!contactIsEmail && !isPlausibleMobile(trimmed)) {
      setError('That does not look like a UAE mobile number. An email works too.');
      return;
    }
    if (!volume) {
      setError('Pick your approximate monthly transactions — a rough band is fine.');
      return;
    }
    if (!software) {
      setError('Tell us what you keep the books in today.');
      return;
    }

    setError('');
    if (contactIsEmail) {
      setEmail(trimmed);
    } else {
      setPhone(trimmed);
    }
    setStep(2);
  };

  return (
    <form
      action={ZOHO_GOOGLE_FORM_ACTION}
      name="form"
      id={formId}
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      onSubmit={() => setIsSubmitting(true)}
      /* Read by src/components/LeadEventTracker.jsx, which owns form_start.
         No `data-lead-form` on purpose: form_name then falls back to the id,
         which is unchanged from the form this replaced, so the before/after
         form-start comparison this change is being measured on stays one
         continuous series in GA4 instead of splitting into two. */
      data-select-param="monthly_transactions"
    >
      <ZohoHiddenFields />

      <div className="form-header">
        <h2 className="form-title">{title}</h2>
        <p className="form-subtitle">{subtitle}</p>
      </div>

      {/* Step one stays mounted through step two rather than unmounting: the
          tracker reads both selects off the DOM at submit time, and an
          unmounted select reports `not_selected` on every completed lead. */}
      <div className="form-field" hidden={!onStepOne}>
        <label htmlFor={`${formId}-contact`}>
          Work email or UAE mobile <em>*</em>
        </label>
        <input
          id={`${formId}-contact`}
          type="text"
          inputMode="email"
          maxLength="255"
          placeholder="name@yourdomain.com or +971 50 000 0000"
          className="form-input"
          autoComplete="email"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
        />
      </div>

      <div className="form-field" hidden={!onStepOne}>
        <label htmlFor={`${formId}-volume`}>
          Approximate monthly transactions <em>*</em>
        </label>
        <select
          id={`${formId}-volume`}
          data-lead-volume=""
          className="form-select"
          value={volume}
          onChange={(event) => setVolume(event.target.value)}
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
        <p className="form-hint">A rough number is fine — it sets the plan and the price.</p>
      </div>

      <div className="form-field" hidden={!onStepOne}>
        <label htmlFor={`${formId}-software`}>
          What do you use today? <em>*</em>
        </label>
        <select
          id={`${formId}-software`}
          data-software=""
          className="form-select"
          value={software}
          onChange={(event) => setSoftware(event.target.value)}
        >
          <option value="" disabled>
            Select your software
          </option>
          {accountingSoftwareOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Step two. Only what the CRM cannot take a lead without: a name, and
          whichever contact channel step one did not collect. */}
      <div className="form-field" hidden={onStepOne}>
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
          required={!onStepOne}
        />
      </div>

      <div className="form-field" hidden={onStepOne}>
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          readOnly={contactIsEmail}
          required={!onStepOne}
        />
      </div>

      <div className="form-field" hidden={onStepOne}>
        <label htmlFor={`${formId}-phone`}>
          Mobile <em>*</em>
        </label>
        {/* Required on every lead form on this site, without exception: the CRM
            mandates a phone number and rejects the record without one. */}
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
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          readOnly={!contactIsEmail}
          required={!onStepOne}
        />
      </div>

      {/* Zoho still receives its company field. Left empty and unasked — the
          business name is collected in sales follow-up rather than charged
          against this form's completion rate. */}
      <input type="hidden" name="SingleLine" value="" readOnly />

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {onStepOne ? (
        <button type="button" className="form-submit" onClick={openStepTwo}>
          <em>{submitLabel}</em>
        </button>
      ) : (
        <>
          <button type="submit" className="form-submit" disabled={isSubmitting}>
            <em>{isSubmitting ? 'Sending…' : submitLabel}</em>
          </button>
          <button type="button" className="form-step-back" onClick={() => setStep(1)}>
            Back to my answers
          </button>
        </>
      )}

      {isSubmitting ? (
        <p className="form-status" role="status" aria-live="polite">
          Sending your request&hellip; you&rsquo;ll see a confirmation in a moment.
        </p>
      ) : null}
    </form>
  );
};

export default BookkeepingPlanForm;
