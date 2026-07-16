import { Outlet } from "react-router-dom";
import { DashboardShell } from "@/components/site/sidebar";

export function DashboardLayout() {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
