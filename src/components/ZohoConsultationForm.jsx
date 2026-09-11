import ZohoHiddenFields from './ZohoHiddenFields';
import { ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import './ZohoConsultationForm.css';

/**
 * The standard "Get Your Free Consultation" lead form.
 *
 * Lifted verbatim from the home page (src/pages/AccountingLanding.jsx), which
 * is the reference every other page's copy was made from. There are currently
 * eight inline copies of this markup across the page files, and they have
 * already started to drift — adding a ninth would make that worse, so this is a
 * component with its own stylesheet and no dependency on the host page's CSS.
 *
 * That self-containment matters: the styles this form needs (.zoho-form,
 * .form-control, .btn-submit-form) live only in AccountingLanding.css, which is
 * not loaded on other routes. Dropping the markup alone onto another page
 * renders it completely unstyled.
 *
 * Do not rename any `name` attribute or change the action URL — Zoho matches on
 * them, and a renamed field arrives empty with no error to tell you. See
 * src/utils/zohoForms.js.
 *
 * @param {{ formId?: string, title?: string, subtitle?: string,
 *   leadSource?: string, privacyNote?: string }} props
 */
const ZohoConsultationForm = ({
  formId = 'form',
  title = 'Get Your Free Consultation',
  subtitle = 'Book a 30-minute call with our experts. No obligation.',
  leadSource = '',
  privacyNote = 'By submitting, you agree to receive communications. Your data is secure and will never be shared.',
}) => (
  <div className="zc-form">
    {title || subtitle ? (
      <div className="form-intro">
        {title ? <h2 className="form-title">{title}</h2> : null}
        {subtitle ? <p className="form-subtitle">{subtitle}</p> : null}
      </div>
    ) : null}

    <form
      action={ZOHO_GOOGLE_FORM_ACTION}
      name="form"
      id={formId}
      method="POST"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      className="zoho-form"
      /* Read by src/components/LeadEventTracker.jsx, which owns form_start and
         the form_submit handoff. Our own attribute rather than a Zoho field
         name: the Zoho names have moved once already. */
      data-lead-form={formId}
    >
      <ZohoHiddenFields leadSource={leadSource} />

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${formId}-first-name`}>First Name</label>
          <input
            id={`${formId}-first-name`}
            type="text"
            maxLength="255"
            name="Name_First"
            fieldType="7"
            placeholder="John"
            className="form-control"
            autoComplete="given-name"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${formId}-last-name`}>Last Name</label>
          <input
            id={`${formId}-last-name`}
            type="text"
            maxLength="255"
            name="Name_Last"
            fieldType="7"
            placeholder="Smith"
            className="form-control"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${formId}-email`}>Email *</label>
        <input
          id={`${formId}-email`}
          type="text"
          maxLength="255"
          name="Email"
          fieldType="9"
          placeholder="john@company.com"
          className="form-control"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${formId}-phone`}>Phone Number *</label>
        <input
          id={`${formId}-phone`}
          type="text"
          compname="PhoneNumber"
          name="PhoneNumber_countrycode"
          phoneFormat="1"
          isCountryCodeEnabled="false"
          maxLength="20"
          fieldType="11"
          placeholder="+971 00 000 0000"
          className="form-control"
          autoComplete="tel"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${formId}-company`}>Company Name *</label>
        <input
          id={`${formId}-company`}
          type="text"
          name="SingleLine"
          maxLength="255"
          fieldType="1"
          placeholder="Your Company LLC"
          className="form-control"
          autoComplete="organization"
          required
        />
      </div>

      <button type="submit" className="btn-submit-form">
        Submit
      </button>
    </form>

    {privacyNote ? <p className="form-privacy">{privacyNote}</p> : null}
  </div>
);

export default ZohoConsultationForm;
