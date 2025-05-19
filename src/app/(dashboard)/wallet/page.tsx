import WalletOverview from "@/components/wallet/wallet-overview";
// import WalletTable from "@/components/wallet/wallet-table";
import WithdrawOverview from "@/components/withdraw/withdraw-overview";
import WithdrawTable from "@/components/withdraw/withdraw-table";

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and track payment status
        </p>
      </div>

      <WalletOverview />
      <WithdrawOverview />
      {/* <WalletTable /> */}
      <WithdrawTable />
    </div>
  );
}
