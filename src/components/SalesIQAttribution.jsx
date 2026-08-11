"use client";
/* eslint-disable no-empty, no-unused-vars --
   Tracking code must never break the page: every risky call (cookies,
   localStorage, URL parsing, third-party globals) is wrapped in a silent
   `catch`. Kept verbatim so this file stays byte-identical across every
   Finanshels site it is dropped into. */
/* ============================================================
   SalesIQAttribution.jsx — Finanshels drop-in for React sites
   v1.1 (2026-08-08)

   One component = the full stack that runs on every Finanshels
   property (see COOKIE_DOMAINS below):
   1. Attribution capture (UTMs + gclid/gbraid/wbraid/fbclid/
      msclkid/li_fat_id/ttclid → fs_first / fs_last cookies)
   2. Zoho Forms iframe patcher (formperma + zfrmz embeds)
   3. WhatsApp [Ref:FS-xxxxxx] tagger + PostHog click event
   4. Zoho SalesIQ widget + visitor.info bridge → CRM fields
      (MGCLID, UTM_*, First_UTM_*, Attribution_Method, …)

   INSTALL — mount ONCE at the app root:
   - Next.js App Router:  render <SalesIQAttribution /> in app/layout.tsx
     (this file already has "use client")
   - Next.js Pages Router: render it in pages/_app.tsx
   - Vite / CRA:          render it in App.jsx
   PostHog is optional — every posthog call is guarded.
   ============================================================ */

import { useEffect } from "react";

const WIDGET_SRC =
  "https://salesiq.zohopublic.com/widget?wc=siqa011f58f27c11f682c3ee45163d23f5d23510ed43403091004de5d7cfe5f4468cc1dcc26b4874c0235a0c032bccd6fff";

/* The chat bubble is hidden site-wide for now. Only the widget injection is
   skipped — attribution capture, the Zoho Forms iframe patcher and the
   WhatsApp/PostHog listeners keep running, so lead tracking is unaffected.
   Flip back to true to bring the chat widget back on every page. */
const IS_SALESIQ_ENABLED = false;

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

/* ---------- 4. SalesIQ + CRM bridge ---------- */
function cleanId(v) {
  return v ? String(v).split("#")[0].split("&")[0].trim() : "";
}
function initSalesIQ() {
  window.$zoho = window.$zoho || {};
  window.$zoho.salesiq = window.$zoho.salesiq || {};
  window.$zoho.salesiq.ready = function () {
    try {
      const a = window.fsAttribution ? window.fsAttribution() : {};
      const p = (x, y) => a[x] || a[y] || "";
      const info = {
        UTM_source: a.utm_source || "",
        UTM_medium: a.utm_medium || "",
        UTM_campaign: a.utm_campaign || "",
        UTM_term: a.utm_term || "",
        UTM_content: a.utm_content || "",
        First_UTM_Source: a.first_utm_source || "",
        First_UTM_Medium: a.first_utm_medium || "",
        First_UTM_Campaign: a.first_utm_campaign || "",
        First_UTM_Term: a.first_utm_term || "",
        First_UTM_Content: a.first_utm_content || "",
        First_Landing_Page: a.first_landing_page || "",
        MGCLID: cleanId(p("gclid", "first_gclid")),
        GBRAID: cleanId(p("gbraid", "first_gbraid")),
        WBRAID: cleanId(p("wbraid", "first_wbraid")),
        FBCLID: cleanId(p("fbclid", "first_fbclid")),
        MSCLKID: cleanId(p("msclkid", "first_msclkid")),
        TTCLID: cleanId(p("ttclid", "first_ttclid")),
        LI_Fat_ID: cleanId(p("li_fat_id", "first_li_fat_id")),
        Click_Timestamp: String(p("click_ts", "first_click_ts")).replace(/\.\d{3}Z$/, "Z"),
        PostHog_Distinct_ID:
          (window.posthog && window.posthog.get_distinct_id && window.posthog.get_distinct_id()) || "",
        Attribution_Method: "SalesIQ Chat",
      };
      const out = {};
      Object.keys(info).forEach((k) => { if (info[k]) out[k] = String(info[k]).slice(0, 250); });
      window.$zoho.salesiq.visitor.info(out);
      try {
        const raw = getCookie("fs_id");
        if (raw) {
          const id = JSON.parse(raw);
          if (id.name) window.$zoho.salesiq.visitor.name(id.name);
          if (id.email) window.$zoho.salesiq.visitor.email(id.email);
          if (id.phone) window.$zoho.salesiq.visitor.contactnumber(id.phone);
        }
      } catch (e) {}
      if (window.posthog && window.posthog.capture) window.posthog.capture("salesiq_widget_ready");
    } catch (e) {}
  };
  if (!document.getElementById("zsiqscript")) {
    const s = document.createElement("script");
    s.id = "zsiqscript";
    s.src = WIDGET_SRC;
    s.defer = true;
    document.body.appendChild(s);
  }
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
        el.href = tagWa(el.href);
        if (window.posthog && window.posthog.capture) {
          const p = window.fsAttribution ? window.fsAttribution() : {};
          p.ref_code = refCode();
          p.wa_href = el.href;
          p.page = window.location.pathname;
          window.posthog.capture("whatsapp_click_attributed", p);
        }
      }
      const t = e.target && e.target.closest
        ? e.target.closest('.zsiq_floatmain,[id^="zsiq_float"],#zsiq_agtpic')
        : null;
      if (t && window.posthog && window.posthog.capture) {
        window.posthog.capture("salesiq_chat_opened", window.fsAttribution ? window.fsAttribution() : {});
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

export default function SalesIQAttribution() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__fsSiq) return; // StrictMode / remount guard
    window.__fsSiq = 1;
    try { initCapture(); } catch (e) {}
    try { initListeners(); } catch (e) {}
    if (IS_SALESIQ_ENABLED) {
      try { initSalesIQ(); } catch (e) {}
    }
  }, []);
  return null;
}
