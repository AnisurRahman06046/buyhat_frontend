import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-foreground">Dashboard Overview</h1>
      <p className="text-body-md text-muted-foreground mt-2">
        Welcome to the BuyHat admin panel. Analytics, KPIs, and operations land in Phase 11.
      </p>
    </div>
  );
}
