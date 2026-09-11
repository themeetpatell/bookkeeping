import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from '@posthog/react';
import QuoteContactStep from './QuoteContactStep';
import QuoteServiceStep from './QuoteServiceStep';
import QuoteQuestionStep from './QuoteQuestionStep';
import QuotePeriodStep from './QuotePeriodStep';
import QuoteResultStep from './QuoteResultStep';
import { getQuotePlan } from '../../content/quoteQuestions';
import {
  QuoteCapReachedError,
  billingCycleFor,
  buildProposalPayload,
  createProposal,
  resolvePrice,
  startQuoteSession,
} from '../../lib/quoteApi';
import { getZohoUtmValues } from '../../utils/zohoUtm';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import './QuoteGenerator.css';

/**
 * Contact-first quote generator, shown in a modal from a "Generate Quote" CTA.
 *
 * The flow is contact → (which service, on a generic page) → the pricing
 * questions → (the period, for a retrospective service) → a real price → a real
 * proposal in FinCore.
 *
 * It does NOT post to Zoho Forms. The proposal engine raises its own qualified
 * deal from the proposal record, so a second write from this page would file a
 * duplicate lead against the same person. That is the whole reason the classic
 * lead forms and this component do not share a submit path.
 *
 * The session call happens before the first question on purpose: it is where
 * FinCore enforces the per-email proposal cap, and a capped visitor should be
 * told immediately rather than after answering everything.
 */

/**
 * The contact details, as analytics properties.
 *
 * Attached to every event that can be a visitor's LAST event, because until the
 * proposal is created these details exist only in this component's state.
 * Someone who fills the form, answers three questions and closes the tab leaves
 * FinCore holding their email and nothing else — no name, no company, no phone,
 * and the CRM mandates a phone number. This is the recovery net: query for
 * quote_started without a matching quote_proposal_created and you have a real,
 * workable list.
 *
 * It is not a CRM and must not become one. The lead of record is the proposal.
 */
const contactProps = (details) => ({
  contact_email: details.contactEmail,
  contact_name: details.contactName,
  contact_mobile: details.contactMobile,
  company_name: details.companyName,
});

const QuoteGenerator = ({ planKey = 'accounting', formId = 'quote-generator', onClose }) => {
  const posthog = usePostHog();
  const plan = getQuotePlan(planKey);

  const [step, setStep] = useState('contact');
  const [contact, setContact] = useState(null);
  /* A single-service page has nothing to choose, so the service is settled
     before the visitor sees anything. */
  const [service, setService] = useState(() => (plan?.needsChoice ? null : plan?.services[0]));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [price, setPrice] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const stepRef = useRef(null);

  const needsPeriod = service?.periodType === 'date_range';
  /* The period counts as a step to the visitor, so the progress bar counts it
     too — "Question 3 of 3" followed by a fourth screen reads as a bug. */
  const totalSteps = (service?.questions.length ?? 0) + (needsPeriod ? 1 : 0);

  /* Quoting the proposal reference saves the visitor explaining themselves and
     saves whoever answers from having to search for the record. */
  const whatsAppHref = useMemo(
    () =>
      buildWhatsAppUrl(
        proposal?.quoteNumber
          ? `Hi Finanshels — I generated proposal ${proposal.quoteNumber} and I'd like to talk it through.`
          : "Hi Finanshels — I generated a quote and I'd like to talk it through.",
      ),
    [proposal?.quoteNumber],
  );

  /* The modal scrolls its own body, so each step starts at the top rather than
     wherever the previous, taller step left the scroll position. */
  useEffect(() => {
    stepRef.current?.scrollTo?.({ top: 0 });
    stepRef.current?.parentElement?.scrollTo?.({ top: 0 });
  }, [step, questionIndex]);

  const handleContactSubmit = useCallback(
    async (details) => {
      setIsStarting(true);
      setSubmitError('');
      try {
        /* Identify BEFORE the session call, so a visitor whose session fails
           or is capped is still a known person rather than an anonymous id. */
        posthog?.identify?.(details.contactEmail, { email: details.contactEmail });

        await startQuoteSession(details.contactEmail);
        setContact(details);
        setStep(plan.needsChoice ? 'service' : 'questions');
        posthog?.capture?.('quote_started', {
          plan: planKey,
          page_path: window.location.pathname,
          ...contactProps(details),
        });
      } catch (error) {
        if (error instanceof QuoteCapReachedError) {
          setStep('capped');
          /* A capped visitor is still a real lead — arguably a better one, since
             they have quoted before. Their details must not be thrown away. */
          posthog?.capture?.('quote_cap_reached', { plan: planKey, ...contactProps(details) });
        } else {
          setSubmitError('We could not start your quote just now. Please try again.');
          posthog?.capture?.('quote_session_failed', {
            reason: error?.message || '',
            ...contactProps(details),
          });
        }
      } finally {
        setIsStarting(false);
      }
    },
    [plan?.needsChoice, planKey, posthog],
  );

  const handleServiceSelect = useCallback(
    (chosen) => {
      /* Switching service invalidates every answer — they are option ids from
         the previous service's questions and would price against the wrong
         path, or be rejected outright. */
      setService(chosen);
      setAnswers([]);
      setQuestionIndex(0);
      setStep('questions');
      /* Carries the contact details for the same reason the others do: picking a
         service and then closing the tab is a dead end like any other, and on
         the generic pages it is the last event before a long question set. */
      posthog?.capture?.('quote_service_selected', {
        plan: planKey,
        service: chosen.slug,
        ...contactProps(contact),
      });
    },
    [contact, planKey, posthog],
  );

  const runPricing = useCallback(
    async (finalAnswers, period) => {
      setStep('calculating');
      try {
        const resolved = await resolvePrice(service.serviceId, finalAnswers);
        setPrice(resolved);

        const billingCycle = billingCycleFor(resolved.billingCycleMode);
        const payload = buildProposalPayload({
          contact,
          billingCycle,
          billingCycleMode: resolved.billingCycleMode ?? null,
          source: 'embed',
          /* Empty for every service that fills its own period. For a
             `date_range` service these are the visitor's own months. */
          period,
          utm: (() => {
            const utm = getZohoUtmValues();
            return {
              utmSource: utm.utm_source || null,
              utmMedium: utm.utm_medium || null,
              utmCampaign: utm.utm_campaign || null,
            };
          })(),
          lineItems: [
            {
              serviceId: service.serviceId,
              serviceName: service.serviceName,
              /* Decides which period fields this line needs. FinCore refuses to
                 save the proposal without them. */
              periodType: service.periodType,
              billingFrequency: resolved.billingFrequency,
              billingBucket: resolved.billingBucket,
              billingCycleMode: resolved.billingCycleMode ?? null,
              pathSnapshot: finalAnswers.map((a) => ({
                questionId: a.questionId,
                optionId: a.optionId,
                questionText: a.questionText,
                optionText: a.optionText,
                optionValue: a.optionValue,
                questionRole: 'base',
              })),
              ruleId: resolved.ruleId ?? null,
              priceMonthly: resolved.priceMonthly,
              priceAnnual: resolved.priceAnnual,
              priceQuarterly: resolved.priceQuarterly,
            },
          ],
        });

        try {
          const created = await createProposal(payload);
          setProposal(created);
          posthog?.capture?.('quote_proposal_created', {
            plan: planKey,
            service: service.slug,
            quote_number: created.quoteNumber,
            price_monthly: resolved.priceMonthly,
          });
          /* A distinct event, not the classic form's `consultation_form_ec`:
             this is a proposal, from a different source, and conflating the two
             would double-count one against the other in Google Ads.
             NOTE: GTM needs a trigger and its own conversion action for this —
             it is not wired by shipping this code. */
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'quote_proposal_created',
            _event: 'quote_proposal_created',
            enhanced_conversion_data: { email: contact.contactEmail },
            user_data: { email: contact.contactEmail },
          });
        } catch (createError) {
          /* The price is real and the visitor earned it, so it is still shown —
             but with nothing filed anywhere, this is a lost lead unless they get
             in touch. Say so plainly rather than promising a callback. The
             reason travels on the analytics event, which is where it is
             actually diagnosable from. */
          posthog?.capture?.('quote_proposal_failed', {
            plan: planKey,
            service: service.slug,
            reason: createError?.message || '',
            status: createError?.status ?? null,
            body: createError?.body || '',
            ...contactProps(contact),
          });
        }

        setStep('result');
      } catch (error) {
        setStep('failed');
        posthog?.capture?.('quote_pricing_failed', {
          plan: planKey,
          reason: error?.message || '',
          ...contactProps(contact),
        });
      }
    },
    [contact, service, planKey, posthog],
  );

  const handleAnswer = useCallback(
    (option) => {
      const question = service.questions[questionIndex];
      const answer = {
        questionId: question.id,
        optionId: option.id,
        optionValue: option.value,
        questionText: question.text,
        optionText: option.text,
      };
      const next = [...answers.filter((a) => a.questionId !== question.id), answer];
      setAnswers(next);

      if (questionIndex + 1 < service.questions.length) {
        setQuestionIndex(questionIndex + 1);
        return;
      }
      /* A retrospective service still needs the window it covers before there is
         anything to save. */
      if (needsPeriod) {
        setStep('period');
        return;
      }
      runPricing(next, {});
    },
    [answers, service, questionIndex, needsPeriod, runPricing],
  );

  /* Only the first question can go back to the service list, and only when there
     was a list to go back to. */
  const backFromQuestion =
    questionIndex > 0
      ? () => setQuestionIndex(questionIndex - 1)
      : plan?.needsChoice
        ? () => setStep('service')
        : null;

  if (!plan) return null;

  const selectedOptionId =
    answers.find((a) => a.questionId === service?.questions[questionIndex]?.id)?.optionId || '';

  return (
    <div className="quote-generator" data-quote-plan={planKey} ref={stepRef}>
      {step === 'contact' ? (
        <QuoteContactStep
          formId={formId}
          isSubmitting={isStarting}
          submitError={submitError}
          onSubmit={handleContactSubmit}
          title="Get your price in 60 seconds"
          subtitle="A few details, a handful of quick questions, and a real number — not a callback."
        />
      ) : null}

      {step === 'service' ? (
        <QuoteServiceStep
          title={plan.chooserTitle}
          subtitle={plan.chooserSubtitle}
          services={plan.services}
          selectedSlug={service?.slug || ''}
          onSelect={handleServiceSelect}
        />
      ) : null}

      {step === 'questions' ? (
        <QuoteQuestionStep
          question={service.questions[questionIndex]}
          index={questionIndex}
          total={totalSteps}
          selectedOptionId={selectedOptionId}
          onAnswer={handleAnswer}
          onBack={backFromQuestion}
        />
      ) : null}

      {step === 'period' ? (
        <QuotePeriodStep
          instruction={service.startDateInstruction}
          index={service.questions.length}
          total={totalSteps}
          value={null}
          onSubmit={(period) => runPricing(answers, period)}
          onBack={() => {
            setQuestionIndex(service.questions.length - 1);
            setStep('questions');
          }}
        />
      ) : null}

      {step === 'calculating' ? (
        <div className="quote-step quote-calculating" data-testid="quote-calculating">
          <span className="quote-spinner" aria-hidden="true" />
          <p className="quote-calculating-text">Building your proposal…</p>
        </div>
      ) : null}

      {step === 'result' && price ? (
        <QuoteResultStep
          price={price}
          proposal={proposal}
          answerCount={answers.length}
          whatsAppHref={whatsAppHref}
        />
      ) : null}

      {step === 'capped' ? (
        <div className="quote-step quote-failed" data-testid="quote-capped">
          <h2 className="quote-question-text">Let&rsquo;s pick this up directly</h2>
          <p className="quote-result-basis">
            We already have proposals on file for this email address. Message us and we&rsquo;ll
            continue from where you left off.
          </p>
          <a className="quote-whatsapp" href={whatsAppHref} target="_blank" rel="noopener noreferrer">
            Talk to us on WhatsApp
          </a>
        </div>
      ) : null}

      {step === 'failed' ? (
        <div className="quote-step quote-failed" data-testid="quote-failed">
          <h2 className="quote-question-text">We couldn&rsquo;t finish that calculation</h2>
          <p className="quote-result-basis">
            Something went wrong on our side. Message us and we&rsquo;ll price this for you in a
            couple of minutes.
          </p>
          <a className="quote-whatsapp" href={whatsAppHref} target="_blank" rel="noopener noreferrer">
            Talk to us on WhatsApp
          </a>
          {onClose ? (
            <button type="button" className="quote-back" onClick={onClose}>
              Close
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default QuoteGenerator;
