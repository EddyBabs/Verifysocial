"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { businessDetails } from "@/schemas/become-a-vendor";
import { redirect } from "next/navigation";
import * as z from "zod";

const clientId = process.env.INSTAGRAM_APP_ID;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
const appSecret = process.env.INSTAGRAM_APP_SECRET;

export const instagramLogin = async () => {
  const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
  redirect(authUrl);
};

export const instagramLogin2 = async (
  values: z.infer<typeof businessDetails>
) => {
  const validatedField = businessDetails.safeParse(values);
  if (validatedField.error) {
    return { error: "Invalid Fields" };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }
  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser?.id,
    },
  });
  if (!vendor) {
    const { businessAbout, businessName, categories, address } =
      validatedField.data;
    await database.address.upsert({
      where: {
        userId: currentUser.id,
      },
      create: {
        userId: currentUser.id,
        city: address.city,
        country: address.country,
        state: address.state,
        street: address.street,
      },
      update: {
        city: address.city,
        state: address.state,
        country: address.country,
        street: address.street,
      },
    });
    await database.vendor.create({
      data: {
        userId: currentUser.id,
        businessName,
        businessAbout,
        categories,
      },
    });
  }
  const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
  redirect(authUrl);
};

export const facebookLink = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }
  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser?.id,
    },
  });
  if (!vendor) {
    await database.vendor.create({
      data: {
        userId: currentUser.id,
      },
    });
  }
  // const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
  // redirect(authUrl);
  // Get facebook username and redirect to facebook auth url
  const facebookAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
  }&redirect_uri=${
    process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI ??
    "https://verifysocial.com.ng/api/social/facebook/callback"
  }&scope=pages_show_list,instagram_basic,instagram_manage_insights,instagram_manage_comments,pages_read_engagement,pages_read_user_content`;
  redirect(facebookAuthUrl);
};

export const fetchFacebookMedia = async () => {
  const currentUser = await getCurrentUser();

  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser?.id,
    },
  });
  if (!vendor) {
    return { error: "Access Denied" };
  }
  const socialPlatform = await database.socialAccount.findUnique({
    where: {
      vendorId_provider: {
        vendorId: vendor.id,
        provider: "FACEBOOK",
      },
    },
  });
  console.log({ socialPlatform });
  if (!socialPlatform?.accessToken) {
    return { failed: true };
  }
  const accessToken = socialPlatform.accessToken;

  const userUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}&fields=id,name,first_name,last_name,username,media_count,account_type`;

  // Fetch the Facebook pages linked to the user's account
  try {
    const pageResponse = await fetch(userUrl);
    const pageData = await pageResponse.json();

    console.dir(pageData, { depth: null });
    if (pageData.data.length > 0) {
      const pageId = pageData.data[0].id;

      const mediaUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
      const mediaResponse = await fetch(mediaUrl);
      const mediaData = await mediaResponse.json();
      console.dir(mediaData, { depth: null });

      if (mediaData.instagram_business_account) {
        const instagramId = mediaData.instagram_business_account.id;

        const userMediaUrl = `https://graph.facebook.com/v21.0/${instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`;
        const mediaResult = await fetch(userMediaUrl);
        const mediaList = await mediaResult.json();

        return { success: mediaList.data };
      }
    }
    // throw new Error("No linked Instagram business account found");
    return { error: "No linked Instagram business account found" };
  } catch (error) {
    console.log("Error Occured");
    console.log({ error });
  }
};

// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { code } = req.query;
//   const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
//   const appId = process.env.FACEBOOK_APP_ID;
//   const appSecret = process.env.FACEBOOK_APP_SECRET;

//   const tokenUrl = `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;

//   const response = await fetch(tokenUrl);
//   const data = await response.json();

//   if (data.access_token) {
//     res.status(200).json({ accessToken: data.access_token });
//   } else {
//     res.status(400).json({ error: "Failed to fetch access token" });
//   }
// }

export const faceBookToken = async (code: string) => {
  const currentUser = await getCurrentUser();

  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser?.id,
    },
  });
  if (!vendor) {
    return { error: "Access Denied" };
  }

  // Check if this is a Facebook callback (from facebookLink) or Instagram callback
  // Facebook callback will have different code format
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  const facebookRedirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

  // Try Facebook OAuth flow first
  try {
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&client_secret=${facebookAppSecret}&code=${code}`
    );
    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Fetch Facebook user profile information
      const userProfileResponse = await fetch(
        `https://graph.facebook.com/v21.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
      );
      const userProfile = await userProfileResponse.json();

      // Fetch Facebook pages (which may have Instagram accounts)
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,username&access_token=${tokenData.access_token}`
      );
      const pagesData = await pagesResponse.json();

      const username =
        pagesData.data?.[0]?.username || userProfile.name || userProfile.id;

      // Store Facebook account details
      await database.socialAccount.upsert({
        where: {
          vendorId_provider: {
            vendorId: vendor.id,
            provider: "FACEBOOK",
          },
        },
        create: {
          provider: "FACEBOOK",
          vendorId: vendor.id,
          accessToken: tokenData.access_token,
          username: username,
          userId: userProfile.id,
        },
        update: {
          accessToken: tokenData.access_token,
          username: username,
          userId: userProfile.id,
        },
      });

      return { success: "Facebook account linked successfully" };
    }
  } catch (facebookError) {
    console.log("Not a Facebook token, trying Instagram...", facebookError);
  }

  // Fall back to Instagram OAuth flow
  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: appSecret!,
      grant_type: "authorization_code",
      redirect_uri: redirectUri!,
      code: code,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    const longLiveDataResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${data.access_token}`,
      {
        method: "GET",
      }
    );
    const longLiveData = await longLiveDataResponse.json();

    const instagramUser = await fetchInstagramUser(longLiveData.access_token);
    console.log({ instagramUser });

    await database.socialAccount.upsert({
      where: {
        vendorId_provider: {
          vendorId: vendor.id,
          provider: "INSTAGRAM",
        },
      },
      create: {
        provider: "INSTAGRAM",
        vendorId: vendor.id,
        accessToken: longLiveData.access_token,
        tokenExpiry: new Date(Date.now() + longLiveData.expires_in * 1000),
        username: instagramUser.username,
        userId: instagramUser.user_id,
      },
      update: {
        accessToken: longLiveData.access_token,
        tokenExpiry: new Date(Date.now() + longLiveData.expires_in * 1000),
        username: instagramUser.username,
        userId: instagramUser.user_id,
      },
    });

    return { success: "Fetched Access token successfully" };
  } else {
    return { error: "Failed to fetch access token" };
  }
};

export const getInstagramLongLiveToken = async (access_token: string) => {
  const response = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${access_token}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Unable to fetch access token");
  }
  const data = await response.json();
  return data;
};

export const refreshInstagramToken = async (accessToken: string) => {
  const response = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
  );
  if (!response.ok) {
    throw new Error("Unable to validate access token");
  }
  const data = await response.json();
  return data;
};

export const fetchInstagramUser = async (access_token: string) => {
  const response = await fetch(
    `https://graph.instagram.com/v22.0/me?fields=user_id,username&access_token=${access_token}`
  );
  if (!response.ok) {
    throw new Error("Unable to validate access token");
  }
  const data = await response.json();
  return data;
};

export const fetchCurrentUserInstagramMedia = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }
  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser.id,
    },
  });
  if (!vendor) {
    return { error: "You are currently not a vendor" };
  }
  const socialAccount = await database.socialAccount.findFirst({
    where: {
      provider: "INSTAGRAM",
      vendorId: vendor.id,
    },
  });
  if (!socialAccount) {
    instagramLogin();
  }
  return { success: [] };
};

export const fetchInstagramMedia = async (
  user_id: string,
  access_token: string
) => {
  const response = await fetch(
    `"https://graph.instagram.com/v22.0/<IG_ID>/media?access_token=<INSTAGRAM_USER_ACCESS_TOKEN>&media_type=IMAGE"`
  );
};

export const getFacebookProfile = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }

  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser.id,
    },
  });
  if (!vendor) {
    return { error: "You are currently not a vendor" };
  }

  const socialAccount = await database.socialAccount.findFirst({
    where: {
      provider: "FACEBOOK",
      vendorId: vendor.id,
    },
  });

  if (!socialAccount) {
    return { error: "No Facebook account linked" };
  }

  return {
    success: true,
    username: socialAccount.username,
    userId: socialAccount.userId,
  };
};

export const unlinkFacebookAccount = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { error: "Access Denied" };
  }

  const vendor = await database.vendor.findUnique({
    where: {
      userId: currentUser.id,
    },
  });
  if (!vendor) {
    return { error: "You are currently not a vendor" };
  }

  await database.socialAccount.deleteMany({
    where: {
      provider: "FACEBOOK",
      vendorId: vendor.id,
    },
  });

  return { success: "Facebook account unlinked successfully" };
};
