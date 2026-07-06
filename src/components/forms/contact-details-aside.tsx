import { getTranslations } from "next-intl/server";
import {
  getMapsDirectionsUrl,
  getMapsEmbedUrl,
  SITE_CONTACT,
} from "@/lib/site/contact";

export async function ContactDetailsAside() {
  const t = await getTranslations("contact.details");

  return (
    <aside className="landing-contact__aside" aria-labelledby="contact-details-title">
      <p className="landing-eyebrow landing-eyebrow--flare">{t("label")}</p>
      <h2 id="contact-details-title" className="landing-contact__title">
        {t("title")}
      </h2>
      <p className="landing-contact__intro">{t("intro")}</p>

      <dl className="landing-contact__list">
        <div className="landing-contact__item">
          <dt>{t("emailLabel")}</dt>
          <dd>
            <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
          </dd>
        </div>

        {SITE_CONTACT.phone ? (
          <div className="landing-contact__item">
            <dt>{t("phoneLabel")}</dt>
            <dd>
              <a href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`}>
                {SITE_CONTACT.phone}
              </a>
            </dd>
          </div>
        ) : null}

        <div className="landing-contact__item">
          <dt>{t("addressLabel")}</dt>
          <dd>
            <address className="landing-contact__address">
              {SITE_CONTACT.street}
              <br />
              {SITE_CONTACT.postalCode} {SITE_CONTACT.city}
              <br />
              {SITE_CONTACT.country}
            </address>
          </dd>
        </div>

        <div className="landing-contact__item">
          <dt>{t("hoursLabel")}</dt>
          <dd>{t("hoursValue")}</dd>
        </div>
      </dl>

      <div className="landing-contact__map">
        <iframe
          title={t("mapTitle")}
          src={getMapsEmbedUrl()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="landing-contact__map-frame"
        />
        <a
          href={getMapsDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="landing-contact__map-link"
        >
          {t("directions")} →
        </a>
      </div>
    </aside>
  );
}
