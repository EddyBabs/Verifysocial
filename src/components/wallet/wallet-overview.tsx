import { getVendorWalletOverview } from "@/actions/vendor";
import WalletOverviewClient from "./wallet-overview-client";

const WalletOverview = async () => {
  const { totalBalance, pendingBalance, availableBalance } =
    await getVendorWalletOverview();
  return (
    <WalletOverviewClient
      totalBalance={totalBalance}
      pendingBalance={pendingBalance}
      availableBalance={availableBalance}
    />
  );
};

export default WalletOverview;
