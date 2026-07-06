"use server";

import { ADMIN_EMAIL, FROM_EMAIL, resend } from "@/lib/resend";
import { z } from "zod";

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(5),
});

export type ContactState = {
  error?: boolean;
  success?: boolean;
};

export async function submitContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: true };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: parsed.data.email,
      subject: `Contactformulier — ${parsed.data.email}`,
      text: `Van: ${parsed.data.email}\n\n${parsed.data.message}`,
    });
  } catch {
    return { error: true };
  }

  return { success: true };
}
