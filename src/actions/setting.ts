"use server";

import { getCurrentUser } from "@/data/user";
import { database, GenderType } from "@/lib/database";
import { settingFormSchema, settingFormSchemaType } from "@/schemas";

export const updateSetting = async (values: settingFormSchemaType) => {
  const userSession = await getCurrentUser();
  if (userSession?.role === "VENDOR") {
    try {
      const validatedField = settingFormSchema.parse(values);
      const { categories, gender, phone, socialPlatform } = validatedField;
      await database.user.update({
        where: { id: userSession.id },
        data: {
          phone,
          gender: gender === "female" ? GenderType.FEMALE : GenderType.MALE,
          vendor: {
            update: {
              categories,
              // socialAccount: {
              //   update:{
              //     data: socialPlatform.map((platform) => ({
              //       provider: platform.platform === "instagram" ? "Instagram"
              //     }))
              //   }
              // }
            },
          },
        },
      });
      return { success: "Updated field successfully" };
    } catch (error) {
      return { error: "Invalid Fields" };
    }
  }
  return { error: "Access Denied!" };
};
