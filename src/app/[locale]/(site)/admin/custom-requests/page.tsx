import { getTranslations } from "next-intl/server";
import { updateCustomRequestStatus } from "@/lib/actions";
import { getAllCustomRequests } from "@/lib/queries";

const statuses = [
  "new",
  "reviewing",
  "quoted",
  "accepted",
  "in_progress",
  "completed",
  "declined",
] as const;

export default async function AdminCustomRequestsPage() {
  const t = await getTranslations("admin");

  let requests: Awaited<ReturnType<typeof getAllCustomRequests>> = [];
  try {
    requests = await getAllCustomRequests();
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="font-display text-3xl">{t("customRequests")}</h1>
      <ul className="mt-8 space-y-4 font-mono text-sm">
        {requests.length === 0 ? (
          <li className="text-cream/50">No requests yet.</li>
        ) : (
          requests.map((req) => (
            <li
              key={req.id}
              className="rounded-xl border-2 border-cream/20 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{req.email}</p>
                  <p className="mt-2 max-w-xl text-cream/80">{req.description}</p>
                  {req.fileUrl && (
                    <a
                      href={req.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-cream/60 underline"
                    >
                      {req.fileName ?? "Download file"}
                    </a>
                  )}
                </div>
                <form
                  action={async (formData) => {
                    "use server";
                    const status = formData.get("status") as (typeof statuses)[number];
                    await updateCustomRequestStatus(req.id, status);
                  }}
                  className="flex items-center gap-2"
                >
                  <select
                    name="status"
                    defaultValue={req.status}
                    className="rounded bg-cream/10 px-2 py-1"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="rounded bg-cream px-3 py-1 text-ink">
                    Save
                  </button>
                </form>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
