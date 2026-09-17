import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getActiveSeller() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const advertiser = await prisma.advertiser.findUnique({
    where: {
      id: user.id,
    },
    include: {
      sellerSubscription: true,
    },
  });

  if (!advertiser) {
    return null;
  }

  const subscription = advertiser.sellerSubscription;

  if (!subscription) {
    return null;
  }

  const now = new Date();

  const isActive =
    subscription.status === "active" &&
    subscription.expiresAt !== null &&
    subscription.expiresAt > now;

  if (!isActive) {
    return null;
  }

  return {
    advertiser,
    subscription,
  };
}