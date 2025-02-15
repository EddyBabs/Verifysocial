export const verifyVercelSignature = async (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    throw new Error("Invalid request signature");
  }
};
