import WithdrawOverview from "@/components/withdraw/withdraw-overview";
import WithdrawTable from "@/components/withdraw/withdraw-table";

export default function WithdrawalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">
          Manage and track your withdrawal requests
        </p>
      </div>

      <WithdrawOverview />
      <WithdrawTable />
    </div>
  );
}
