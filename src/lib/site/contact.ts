export const SITE_CONTACT = {
  email: "hello@moosdesign.be",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  street: "Kongostraat 18",
  postalCode: "9000",
  city: "Gent",
  country: "Belgium",
} as const;

export function getContactAddressLine() {
  return `${SITE_CONTACT.street}, ${SITE_CONTACT.postalCode} ${SITE_CONTACT.city}`;
}

export function getMapsQuery() {
  return `${SITE_CONTACT.street}, ${SITE_CONTACT.postalCode} ${SITE_CONTACT.city}, ${SITE_CONTACT.country}`;
}

export function getMapsEmbedUrl() {
  const q = encodeURIComponent(getMapsQuery());
  return `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
}

export function getMapsDirectionsUrl() {
  const q = encodeURIComponent(getMapsQuery());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
