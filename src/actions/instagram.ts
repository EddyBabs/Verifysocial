"use server";

import { getCurrentUser } from "@/data/user";
import { database } from "@/lib/database";
import { redirect } from "next/navigation";

const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

export const facebookLogin = async () => {
  const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,instagram_basic,instagram_manage_insights&response_type=code`;
  redirect(authUrl);
  // Redirect the user to authUrl to log in and authorize
};

export const fetchInstagramMedia = async (accessToken: string) => {
  const userUrl = `https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}`;

  // Fetch the Facebook pages linked to the user's account
  const pageResponse = await fetch(userUrl);
  const pageData = await pageResponse.json();

  if (pageData.data.length > 0) {
    const pageId = pageData.data[0].id;

    const mediaUrl = `https://graph.facebook.com/v17.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
    const mediaResponse = await fetch(mediaUrl);
    const mediaData = await mediaResponse.json();

    if (mediaData.instagram_business_account) {
      const instagramId = mediaData.instagram_business_account.id;

      const userMediaUrl = `https://graph.facebook.com/v17.0/${instagramId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`;
      const mediaResult = await fetch(userMediaUrl);
      const mediaList = await mediaResult.json();

      return mediaList.data;
    }
  }
  throw new Error("No linked Instagram business account found");
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

  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const tokenUrl = `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;

  const response = await fetch(tokenUrl);
  const data = await response.json();

  if (data.access_token) {
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
        accessToken: data.access_token,
      },
      update: {
        accessToken: data.access_token,
      },
    });

    return { success: "Fetched Access token successfully" };
  } else {
    return { error: "Failed to fetch access token" };
  }
};
