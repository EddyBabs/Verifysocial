import { auth } from "@/lib/auth";
import { database } from "@/lib/database";

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

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const getCurrentUserDetails = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    throw new Error("Error getting user");
  }
  return getUserById(currentUser.id);
};
