// Single source of truth for the "Book a Free Call" CTA destination. Kept in
// one place because the same link is rendered from the global nav, the footer,
// and the WhatsApp landing page — swapping the scheduler should be a one-line
// change, not a repo-wide find and replace.

export const BOOKING_URL = 'https://finanshels.com/schedule-a-free-consultation';
