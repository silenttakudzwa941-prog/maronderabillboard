import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      id: user.id,
    },
  });

  return admin;
}