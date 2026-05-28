import crypto from "node:crypto";

const ACCESS_TOKEN = process.env.MONIME_ACCESS_TOKEN!;
const SPACE_ID = process.env.MONIME_SPACE_ID!;
const WEBHOOK_SECRET = process.env.MONIME_WEBHOOK_SECRET!;
const MONIME_VERSION = process.env.MONIME_VERSION || "caph.2025-08-23";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "";

const BASE = "https://api.monime.io";

type LineItem = {
  name: string;
  quantity: number;
  price: number;
};

type CreateCheckoutInput = {
  name: string;
  phone: string;
  reference: string;
  lineItems: LineItem[];
};

export async function createCheckout(input: CreateCheckoutInput) {
  if (!input.lineItems || input.lineItems.length === 0) {
    throw new Error("Monime checkout requires at least one line item");
  }

  const res = await fetch(`${BASE}/v1/checkout-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Monime-Space-Id": SPACE_ID,
      "Idempotency-Key": crypto.randomUUID(),
      "Monime-Version": MONIME_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      reference: input.reference,
      description: `Order ${input.reference}`,
      callbackState: input.phone,
      successUrl: APP_URL ? `${APP_URL.replace(/\/$/, "")}/ticket/${input.reference}` : undefined,
      cancelUrl: APP_URL ? `${APP_URL.replace(/\/$/, "")}/` : undefined,
      lineItems: (input.lineItems ?? []).map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: { currency: "SLE", value: item.price },
        type: "custom",
        reference: input.reference,
      })),
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`[Monime API Error] Status: ${res.status}, Response: ${text}`);
    throw new Error(`monime ${res.status}: ${text || "Unknown error"}`);
  }

  try {
    const data = JSON.parse(text);
    // API returns wrapper { success, messages, result }
    const result = data.result ?? data;
    return {
      raw: data,
      id: result.id as string,
      redirect_url: result.redirectUrl || result.redirect_url || result.redirect || null,
    };
  } catch (e) {
    throw new Error(`Invalid JSON response from monime: ${text}`);
  }
}

export function verifyWebhook(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;

  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const [key, ...rest] = part.split("=");
    parts[key] = rest.join("=");
  }

  const timestamp = parts["t"];
  const receivedSig = parts["v1"];
  if (!timestamp || !receivedSig) return false;

  const ts = parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;
  const age = Math.floor(Date.now() / 1000) - ts;
  if (age > 5 * 60 || age < -60) return false;

  const expectedB64 = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(`${timestamp}_${rawBody}`, "utf8")
    .digest("base64");

  try {
    const a = Buffer.from(receivedSig, "base64");
    const b = Buffer.from(expectedB64, "base64");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
