"use server";

import { getCurrentUser } from "@/data/user";
import { database, GenderType } from "@/lib/database";

export const updateUser = async (data: {
  fullname?: string;
  phone?: string;
  gender?: string;
}) => {
  // Implementation for updating user details
  const userSession = await getCurrentUser();
  if (!userSession?.id) {
    throw new Error("User not authenticated");
  }

  await database.user.update({
    where: { id: userSession.id },
    data: {
      fullname: data.fullname,
      phone: data.phone,
      gender: data.gender === "female" ? GenderType.FEMALE : GenderType.MALE,
    },
  });

  return { success: true };
};
