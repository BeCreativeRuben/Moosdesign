import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth(locale = "nl") {
  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/auth/sign-in`);
  }
  return session;
}

export async function requireAdmin(locale = "nl") {
  const session = await requireAuth(locale);
  if (session.user.role !== "admin") {
    redirect(`/${locale}`);
  }
  return session;
}
