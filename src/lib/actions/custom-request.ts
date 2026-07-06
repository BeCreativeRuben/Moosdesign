"use server";

import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { customRequests } from "@/lib/db/schema";
import { ADMIN_EMAIL, FROM_EMAIL, resend } from "@/lib/resend";
import { z } from "zod";

const customRequestSchema = z.object({
  email: z.string().email(),
  description: z.string().min(10),
});

export type CustomRequestState = {
  error?: string;
  success?: boolean;
  id?: string;
};

export async function submitCustomRequest(
  _prev: CustomRequestState,
  formData: FormData,
): Promise<CustomRequestState> {
  const session = await auth();
  const parsed = customRequestSchema.safeParse({
    email: formData.get("email"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  let fileUrl: string | undefined;
  let fileName: string | undefined;
  const file = formData.get("file") as File | null;

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File too large (max 10 MB)" };
    }

    const blob = await put(`custom-requests/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    fileUrl = blob.url;
    fileName = file.name;
  }

  const [request] = await db
    .insert(customRequests)
    .values({
      userId: session?.user?.id,
      email: parsed.data.email,
      description: parsed.data.description,
      fileUrl,
      fileName,
    })
    .returning();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Nieuwe custom print aanvraag — ${parsed.data.email}`,
    text: [
      `Email: ${parsed.data.email}`,
      `Beschrijving:\n${parsed.data.description}`,
      fileUrl ? `Bestand: ${fileUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: parsed.data.email,
    subject: "We hebben je aanvraag ontvangen — Moosdesign",
    text: "Bedankt voor je custom print aanvraag! We bekijken je bericht en nemen zo snel mogelijk contact op.",
  });

  return { success: true, id: request.id };
}
