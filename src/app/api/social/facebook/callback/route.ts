import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { getCurrentUser } from "@/data/user";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    console.log({ code, error });
    // Handle OAuth error
    if (error) {
      return NextResponse.redirect(
        new URL(
          `/?error=${encodeURIComponent("Facebook authentication failed")}`,
          request.url
        )
      );
    }

    // Validate authorization code

    if (!code) {
      return NextResponse.redirect(
        new URL(
          `/?error=${encodeURIComponent("No authorization code received")}`,
          request.url
        )
      );
    }

    // Get current user
    const currentUser = await getCurrentUser();
    console.log({ currentUser });
    if (!currentUser || !currentUser.id) {
      return NextResponse.redirect(
        new URL(
          `/auth/signin?error=${encodeURIComponent("Please sign in first")}`,
          request.url
        )
      );
    }

    // Get or create vendor
    let vendor = await database.vendor.findUnique({
      where: {
        userId: currentUser.id,
      },
    });

    if (!vendor) {
      vendor = await database.vendor.create({
        data: {
          userId: currentUser.id,
        },
      });
    }

    // Exchange code for access token
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    const facebookRedirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

    if (!facebookAppId || !facebookAppSecret || !facebookRedirectUri) {
      return NextResponse.redirect(
        new URL(
          `/settings?error=${encodeURIComponent(
            "Facebook configuration error"
          )}`,
          request.url
        )
      );
    }

    const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&client_secret=${facebookAppSecret}&code=${code}`;
    console.log({ tokenUrl });
    const tokenResponse = await fetch(tokenUrl);
    console.log({ tokenResponse });
    const tokenData = await tokenResponse.json();
    console.log({ tokenData });

    if (!tokenResponse.ok || tokenData.error) {
      console.log({ error: tokenData.error });
      return NextResponse.redirect(
        new URL(
          `/?error=${encodeURIComponent(
            tokenData.error?.message || "Failed to get access token"
          )}`,
          request.url
        )
      );
    }

    const accessToken = tokenData.access_token;
    console.log({ accessToken });

    // Fetch user profile from Facebook
    const profileResponse = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,email&access_token=${accessToken}`
    );
    const profileData = await profileResponse.json();

    if (!profileResponse.ok || profileData.error) {
      return NextResponse.redirect(
        new URL(
          `/settings?error=${encodeURIComponent(
            "Failed to fetch Facebook profile"
          )}`,
          request.url
        )
      );
    }

    // Fetch Facebook pages to get username
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesResponse.json();

    let username = profileData.name || profileData.id;
    if (pagesData.data && pagesData.data.length > 0) {
      username =
        pagesData.data[0].name || pagesData.data[0].username || username;
    }

    // Check if Facebook account already linked
    const existingSocialAccount = await database.socialAccount.findFirst({
      where: {
        provider: "FACEBOOK",
        vendorId: vendor.id,
      },
    });

    if (existingSocialAccount) {
      // Update existing account
      await database.socialAccount.update({
        where: {
          id: existingSocialAccount.id,
        },
        data: {
          accessToken: accessToken,
          username: username,
          userId: profileData.id,
        },
      });
    } else {
      // Create new social account
      await database.socialAccount.create({
        data: {
          provider: "FACEBOOK",
          accessToken: accessToken,
          username: username,
          userId: profileData.id,
          vendorId: vendor.id,
        },
      });
    }

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(
        `/?success=${encodeURIComponent(
          "Facebook account linked successfully"
        )}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Facebook callback error:", error);
    console.log({ error });
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent("An unexpected error occurred")}`,
        request.url
      )
    );
  }
}
