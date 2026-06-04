const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=971521549572&text=Hi%2C+I%27d+like+to+claim+the+20%25+OFF+%2B+AED+100+Voucher+offer+on+your+Audit+%26+Accounting+plans.&type=phone_number&app_absent=0';

const OfferBar = () => {
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source: 'offer_bar' });
    }
  };

  return (
    <div className="offer-bar" role="region" aria-label="Limited time offer">
      <div className="offer-bar-inner">
        <div className="offer-bar-message">
          <span className="offer-bar-badge">Limited Offer</span>
          <p className="offer-bar-text">
            Get <strong>20% OFF</strong> and an <strong>AED&nbsp;100 Voucher</strong> on all Audit &amp; Accounting plans.
          </p>
        </div>
        <a
          href={WHATSAPP_URL}
          className="offer-bar-cta data-wa-track"
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
        >
          <svg className="offer-bar-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.42 1.31-1.95 1.35-.5.04-.95.22-3.2-.67-2.7-1.06-4.42-3.82-4.56-4-.13-.18-1.1-1.46-1.1-2.78 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.24.55.81 1.9.88 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.27.34-.22.57-.13.24.09 1.5.71 1.76.84.26.13.43.2.49.31.07.11.07.63-.17 1.31Z"
            />
          </svg>
          WhatsApp Now
        </a>
      </div>
    </div>
  );
};

export default OfferBar;
