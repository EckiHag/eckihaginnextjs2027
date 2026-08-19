"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export async function saveDate(formData: FormData) {
  const oid = String(formData.get("oid") ?? "");
  const termin = String(formData.get("termin") ?? "");
  const ferien = String(formData.get("ferien") ?? "");

  if (!oid) {
    throw new Error("OID fehlt.");
  }

  const updatedDate = await prisma.dates.update({
    where: {
      OID: oid,
    },
    data: {
      Termin: termin,
      Ferien: ferien,
    },
  });

  const dateString = format(updatedDate.Datum, "yyyy-MM-dd");

  revalidatePath("/kalender");

  redirect(`/kalender?scrollTo=${dateString}`);
}
