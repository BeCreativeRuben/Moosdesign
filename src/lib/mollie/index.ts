import createMollieClient, {
  PaymentMethod,
  type MollieClient,
} from "@mollie/api-client";

let mollieInstance: MollieClient | null = null;

export function getMollie(): MollieClient {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error("MOLLIE_API_KEY is not set");
  }
  if (!mollieInstance) {
    mollieInstance = createMollieClient({ apiKey });
  }
  return mollieInstance;
}

/** Convert integer cents to Mollie's decimal amount string, e.g. 1234 → "12.34" */
export function centsToMollieAmount(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error(`Invalid amount in cents: ${cents}`);
  }
  return (cents / 100).toFixed(2);
}

export function formatPrice(cents: number, locale = "nl-BE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/** Bancontact + credit card (iDEAL optional later). */
export const MOLLIE_METHODS: PaymentMethod[] = [
  PaymentMethod.bancontact,
  PaymentMethod.creditcard,
];

export { PaymentMethod };
