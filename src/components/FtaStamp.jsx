/* The credential applied to the corner of a lead form, the way a seal is
 * applied to a signed document.
 *
 * This is the real stamp artwork, not a CSS reconstruction: the rotation, the
 * rounded double border, the broken ink edges and the authority mark are all
 * baked into the asset, so the styles here only position and size it. Do not
 * add a background, border, shadow or transform — every one of those fights the
 * artwork and makes it read as a sticker again.
 *
 * The source was 1496x1496 on an opaque white background. It ships keyed to
 * transparency and resized (see public/fta-stamp.png, 440x440), so it sits on a
 * coloured card without a white box behind it.
 *
 * The wording is a UAE regulatory claim, so it is not a styling choice: the
 * approved claim is "FTA Registered Tax Agency" and it must stay identical to
 * the one FtaBadge renders. The artwork originally read "FTA-approved Tax
 * Agency firm"; those two bold lines were re-set by scripts/build-fta-stamp.py,
 * which is also how any future wording change is made. The frame, the authority
 * mark and the registration number are untouched original artwork. Changing the
 * alt text alone does not fix a wrong claim — it is baked into the pixels.
 *
 * Distinct from FtaBadge, which is the horizontal card under a hero CTA. This
 * one is absolutely positioned and belongs INSIDE a form card — every container
 * it is dropped into is given `position: relative` in App.css, so adding it to a
 * new form means adding that class there too or the stamp escapes to the
 * nearest positioned ancestor.
 */
const STAMP_PNG = '/fta-stamp.png';
const STAMP_WEBP = '/fta-stamp.webp';
const AGENCY_NUMBER = '30022628';

const FtaStamp = () => (
  <span className="fta-stamp">
    <picture>
      <source srcSet={STAMP_WEBP} type="image/webp" />
      <img
        src={STAMP_PNG}
        alt={`FTA Registered Tax Agency, registration number ${AGENCY_NUMBER}`}
        className="fta-stamp-img"
        width="440"
        height="440"
        loading="lazy"
        decoding="async"
      />
    </picture>
  </span>
);

export default FtaStamp;
