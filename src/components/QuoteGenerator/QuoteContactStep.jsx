import { useState } from 'react';

/**
 * Step 1 of the quote generator: the contact details, captured before any
 * question is asked.
 *
 * Contact-first matches the proposal engine at fincore.finanshels.com/q/start,
 * which cannot mint an anonymous proposal — a proposal is a real record with a
 * reference number, an engagement letter and a payment link.
 *
 * These details go to the proposal engine ONLY. Nothing here posts to Zoho
 * Forms: the proposal engine raises its own qualified deal, and a second write
 * from this page would file a duplicate lead against the same person.
 *
 * Validation mirrors FinCore's own rules so a visitor is not accepted here and
 * rejected at proposal creation.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_SHAPE = /^[+\d][\d\s\-().]+$/;
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;

const validate = ({ companyName, contactName, contactEmail, contactMobile }) => {
  const errors = {};
  if (companyName.trim().length < 2) errors.companyName = 'Please enter your business name';
  if (contactName.trim().length < 2) errors.contactName = 'Please enter your name';
  if (!EMAIL_PATTERN.test(contactEmail.trim())) errors.contactEmail = 'Please enter a valid email';

  const digits = contactMobile.replace(/\D/g, '');
  if (
    digits.length < MIN_PHONE_DIGITS ||
    digits.length > MAX_PHONE_DIGITS ||
    !PHONE_SHAPE.test(contactMobile.trim())
  ) {
    errors.contactMobile = 'Please enter a valid mobile number';
  }
  return errors;
};

const EMPTY = { companyName: '', contactName: '', contactEmail: '', contactMobile: '' };

const QuoteContactStep = ({ formId, onSubmit, isSubmitting, submitError, title, subtitle }) => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const setField = (field) => (event) => {
    const { value } = event.target;
    // New object rather than a mutation, so React always sees a changed state.
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      companyName: values.companyName.trim(),
      contactName: values.contactName.trim(),
      contactEmail: values.contactEmail.trim(),
      contactMobile: values.contactMobile.trim(),
    });
  };

  const field = (name, label, extra = {}) => (
    <div className="quote-field">
      <label htmlFor={`${formId}-${name}`}>
        {label} <em>*</em>
      </label>
      <input
        id={`${formId}-${name}`}
        name={name}
        className="quote-input"
        value={values[name]}
        onChange={setField(name)}
        aria-invalid={errors[name] ? 'true' : undefined}
        aria-describedby={errors[name] ? `${formId}-${name}-error` : undefined}
        {...extra}
      />
      {errors[name] ? (
        <p className="quote-field-error" id={`${formId}-${name}-error`} role="alert">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form className="quote-form" id={formId} onSubmit={handleSubmit} noValidate>
      <div className="quote-form-header">
        <h2 className="quote-form-title">{title}</h2>
        <p className="quote-form-subtitle">{subtitle}</p>
      </div>

      {field('companyName', 'Business name', {
        type: 'text',
        placeholder: 'i.e. Dropxcell LLC',
        autoComplete: 'organization',
        maxLength: 255,
      })}
      {field('contactName', 'Your name', {
        type: 'text',
        placeholder: 'i.e. John Smith',
        autoComplete: 'name',
        maxLength: 255,
      })}
      {field('contactEmail', 'Work email', {
        type: 'email',
        placeholder: 'i.e. name@yourdomain.com',
        autoComplete: 'email',
        maxLength: 255,
      })}
      {field('contactMobile', 'Mobile', {
        type: 'tel',
        placeholder: '+971 50 123 4567',
        autoComplete: 'tel',
        maxLength: 20,
      })}

      {submitError ? (
        <p className="quote-field-error quote-submit-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="quote-submit" disabled={isSubmitting}>
        <em>{isSubmitting ? 'Starting…' : 'Start quote →'}</em>
      </button>

      <p className="quote-form-note">
        No card needed. You&rsquo;ll see your price on the next screen.
      </p>
    </form>
  );
};

export default QuoteContactStep;
