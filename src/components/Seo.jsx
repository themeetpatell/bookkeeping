import { useEffect } from 'react';

const getOrCreateTag = (selector, createTag) => {
  const existing = document.head.querySelector(selector);
  if (existing) {
    return existing;
  }
  const tag = createTag();
  document.head.appendChild(tag);
  return tag;
};

const setMetaTag = ({ name, property, content }) => {
  if (!content) {
    return;
  }
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  const meta = getOrCreateTag(selector, () => {
    const el = document.createElement('meta');
    if (name) {
      el.setAttribute('name', name);
    }
    if (property) {
      el.setAttribute('property', property);
    }
    return el;
  });
  meta.setAttribute('content', content);
};

const setLinkTag = ({ rel, href }) => {
  if (!href) {
    return;
  }
  const selector = `link[rel="${rel}"]`;
  const link = getOrCreateTag(selector, () => {
    const el = document.createElement('link');
    el.setAttribute('rel', rel);
    return el;
  });
  link.setAttribute('href', href);
};

const setJsonLd = (jsonLd) => {
  const existing = document.head.querySelector('script[data-seo-jsonld="true"]');
  if (!jsonLd) {
    if (existing) {
      existing.remove();
    }
    return;
  }
  const script = existing || document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-jsonld', 'true');
  script.textContent = JSON.stringify(jsonLd);
  if (!existing) {
    document.head.appendChild(script);
  }
};

const buildUrl = (path) => {
  if (!path) {
    return '';
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return origin ? `${origin}${path}` : path;
};

const Seo = ({
  title,
  description,
  canonicalPath,
  image,
  jsonLd,
  ogType = 'website',
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const canonicalUrl = canonicalPath ? buildUrl(canonicalPath) : '';

    setMetaTag({ name: 'description', content: description });
    // Paid-advertising site: nothing here should surface in organic search.
    // Mirrors the static tag in index.html and the X-Robots-Tag in vercel.json.
    setMetaTag({ name: 'robots', content: 'noindex, nofollow' });
    setMetaTag({ property: 'og:type', content: ogType });
    setMetaTag({ property: 'og:title', content: title });
    setMetaTag({ property: 'og:description', content: description });
    setMetaTag({ property: 'og:url', content: canonicalUrl });
    setMetaTag({ property: 'og:image', content: image ? buildUrl(image) : '' });
    setMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
    setMetaTag({ name: 'twitter:title', content: title });
    setMetaTag({ name: 'twitter:description', content: description });
    setMetaTag({ name: 'twitter:image', content: image ? buildUrl(image) : '' });
    setLinkTag({ rel: 'canonical', href: canonicalUrl });
    setJsonLd(jsonLd);
  }, [title, description, canonicalPath, image, jsonLd, ogType]);

  return null;
};

export default Seo;
