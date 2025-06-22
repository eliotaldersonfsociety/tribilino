import type React from "react"
import "@/app/globals.css"
import "./dashboard-variables.css"

// app/(admin)/dashboards/layout.tsx
export default function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <>{children}</>;
}
