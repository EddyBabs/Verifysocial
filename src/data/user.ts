import { auth } from "@/lib/auth";
import { database } from "@/lib/database";
import { redirect } from "next/navigation";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await database.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await database.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};

export const getCurrentUser = async (enableRedirect: boolean = true) => {
  const session = await auth();
  const userSession = session?.user;
  if (!userSession && enableRedirect) {
    redirect("/auth/signin");
  }
  return userSession;
};

export const getCurrentUserDetails = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return redirect("/auth/signin");
  }
  const credentials = await database.kYCCredential.count({
    where: {
      vendorId: currentUser.id,
      status: "APPROVED",
    },
  });

  const user = await database.user.findUnique({
    where: { id: currentUser.id },
    select: {
      fullname: true,
      email: true,
      gender: true,
      phone: true,
      role: true,
      vendor: {
        select: {
          tier: true,
          buisnessName: true,
          buisnessAbout: true,
        },
      },
    },
  });
  if (!user) {
    return redirect("/auth/signin");
  }
  const ninVerified = !!credentials;
  return { user, ninVerified };
};

export const getVendorDetails = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    throw new Error("Access Denied");
  }
};
