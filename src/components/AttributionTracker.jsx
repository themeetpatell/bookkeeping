"use client";
/* eslint-disable no-empty, no-unused-vars --
   Tracking code must never break the page: every risky call (cookies,
   localStorage, URL parsing, third-party globals) is wrapped in a silent
   `catch`. Kept verbatim so this file stays byte-identical across every
   Finanshels site it is dropped into. */
/* ============================================================
   AttributionTracker.jsx — Finanshels drop-in for React sites
   v1.2

   One component = attribution and lead tracking stack:
   1. Attribution capture (UTMs + gclid/gbraid/wbraid/fbclid/
      msclkid/li_fat_id/ttclid → fs_first / fs_last cookies)
   2. Zoho Forms iframe patcher (formperma + zfrmz embeds)
   3. WhatsApp [Ref:FS-xxxxxx] tagger (off here) + PostHog click event

   INSTALL — mount ONCE at the app root:
   - Next.js App Router:  render <AttributionTracker /> in app/layout.tsx
     (this file already has "use client")
   - Next.js Pages Router: render it in pages/_app.tsx
   - Vite / CRA:          render it in App.jsx
   PostHog is optional — every posthog call is guarded.
   ============================================================ */

import { useEffect } from "react";

/* The [Ref:FS-xxxxxx] code is appended to the prefilled WhatsApp message in
   plain sight, and reads as noise to a prospect opening their first chat. This
   site instead leans on the Gallabox tracker (see WhatsAppTracker.jsx), which
   hides the source page in the message as zero-width characters — invisible to
   the customer. That only carries the landing page, not the campaign or gclid,
   so flip this back to true wherever the ad-level join matters more than the
   cosmetics. The PostHog click event fires either way. */
const IS_WA_REF_TAG_ENABLED = false;

const PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "li_fat_id", "ttclid",
];

/* Registrable domains this component may be served from. Attribution cookies
   are widened to `.<domain>` so they survive navigation between that domain's
   subdomains. Cookies cannot be shared ACROSS these entries — each registrable
   domain keeps its own fs_first / fs_last.

   The main Finanshels web presence is deliberately absent: this ads-only site
   never runs there, and nothing in this repo may reference or link to it. */
const COOKIE_DOMAINS = ["finanshelsaccounting.co", "finanshels.co"];

/* ---------- cookies ---------- */
function getCookie(n) {
  const m = document.cookie.match("(?:^|; )" + n + "=([^;]*)");
  return m ? decodeURIComponent(m[1]) : null;
}
/* Exact suffix match, never `indexOf`: a host ending in ".co" + one more letter
   still contains the substring of a shorter entry above, so a substring test
   would set an unsettable cookie domain on the wrong host and silently drop
   it. */
function cookieDomain() {
  const host = location.hostname;
  for (let i = 0; i < COOKIE_DOMAINS.length; i++) {
    const d = COOKIE_DOMAINS[i];
    if (host === d || host.slice(-(d.length + 1)) === "." + d) return d;
  }
  return null;
}
function setCookie(n, v, days) {
  const e = new Date();
  e.setDate(e.getDate() + days);
  let c = n + "=" + encodeURIComponent(v) + "; expires=" + e.toUTCString() + "; path=/; SameSite=Lax";
  // Share attribution across subdomains of a known domain; host-only elsewhere
  const d = cookieDomain();
  if (d) c += "; domain=." + d;
  document.cookie = c;
}

/* ---------- 1. capture ---------- */
function initCapture() {
  const q = new URLSearchParams(window.location.search);
  const cur = {};
  let tagged = false;
  PARAMS.forEach((k) => { const v = q.get(k); if (v) { cur[k] = v; tagged = true; } });
  if (tagged) {
    cur.landing_page = window.location.origin + window.location.pathname;
    cur.referrer = document.referrer || "";
    cur.click_ts = new Date().toISOString();
    setCookie("fs_last", JSON.stringify(cur), 90);
    let hasFirst = false;
    try { hasFirst = !!(getCookie("fs_first") || localStorage.getItem("fs_first")); }
    catch (e) { hasFirst = !!getCookie("fs_first"); }
    if (!hasFirst) {
      setCookie("fs_first", JSON.stringify(cur), 365);
      try { localStorage.setItem("fs_first", JSON.stringify(cur)); } catch (e) {}
    }
  }
  window.fsAttribution = function attr() {
    const out = {};
    try {
      const f = getCookie("fs_first") || localStorage.getItem("fs_first");
      if (f) { const fo = JSON.parse(f); Object.keys(fo).forEach((k) => { out["first_" + k] = fo[k]; }); }
    } catch (e) {}
    try {
      const l = getCookie("fs_last");
      if (l) { const lo = JSON.parse(l); Object.keys(lo).forEach((k) => { out[k] = lo[k]; }); }
    } catch (e) {}
    const fbc = getCookie("_fbc"), fbp = getCookie("_fbp");
    if (fbc) out.fbc = fbc;
    if (fbp) out.fbp = fbp;
    return out;
  };
}

/* ---------- 2. Zoho Forms iframe patcher ---------- */
function patchIframes() {
  try {
    const a = window.fsAttribution ? window.fsAttribution() : {};
    const keys = Object.keys(a);
    if (!keys.length) return;
    const frames = document.getElementsByTagName("iframe");
    for (let i = 0; i < frames.length; i++) {
      const src = frames[i].src || "";
      if ((src.indexOf("formperma") > -1 || src.indexOf("zfrmz.com") > -1) && !frames[i].getAttribute("data-fs-patched")) {
        const add = [];
        keys.forEach((k) => { if (src.indexOf(k + "=") === -1) add.push(k + "=" + encodeURIComponent(a[k])); });
        if (add.length) frames[i].src = src + (src.indexOf("?") > -1 ? "&" : "?") + add.join("&");
        frames[i].setAttribute("data-fs-patched", "1");
      }
    }
  } catch (e) {}
}

/* ---------- 3. WhatsApp ref tagger ---------- */
function refCode() {
  let c = null;
  try { c = localStorage.getItem("fs_ref"); } catch (e) {}
  if (!c) {
    c = "FS-" + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem("fs_ref", c); } catch (e) {}
  }
  return c;
}
function tagWa(href) {
  try {
    const u = new URL(href, window.location.href);
    if (!/wa\.me|api\.whatsapp\.com/.test(u.host)) return href;
    const t = u.searchParams.get("text") || "";
    if (t.indexOf("[Ref:") > -1) return href;
    u.searchParams.set("text", (t ? t + " " : "") + "[Ref:" + refCode() + "]");
    return u.toString();
  } catch (e) { return href; }
}

/* ---------- listeners ---------- */
function initListeners() {
  if (document.readyState !== "loading") setTimeout(patchIframes, 500);
  window.addEventListener("load", () => setTimeout(patchIframes, 500));
  document.addEventListener("click", (e) => {
    setTimeout(patchIframes, 700);
    try {
      const el = e.target && e.target.closest ? e.target.closest("a") : null;
      if (el && /wa\.me|api\.whatsapp\.com/.test(el.href || "")) {
        if (IS_WA_REF_TAG_ENABLED) el.href = tagWa(el.href);
        if (window.posthog && window.posthog.capture) {
          const p = window.fsAttribution ? window.fsAttribution() : {};
          if (IS_WA_REF_TAG_ENABLED) p.ref_code = refCode();
          p.wa_href = el.href;
          p.page = window.location.pathname;
          window.posthog.capture("whatsapp_click_attributed", p);
        }
      }
    } catch (err) {}
  }, true);
  document.addEventListener("submit", (ev) => {
    try {
      const f = ev.target;
      if (!f || f.tagName !== "FORM") return;
      const el = f.querySelector('input[type="email"], input[name="Email"], input[name="email"]');
      const email = el && el.value ? el.value.trim().toLowerCase() : "";
      if (email && window.posthog && window.posthog.identify) {
        window.posthog.identify(email, { email });
        window.posthog.capture("lead_form_submitted", window.fsAttribution ? window.fsAttribution() : {});
      }
    } catch (e) {}
  }, true);
}

export default function AttributionTracker() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__fsAttr) return; // StrictMode / remount guard
    window.__fsAttr = 1;
    try { initCapture(); } catch (e) {}
    try { initListeners(); } catch (e) {}
  }, []);
  return null;
}
