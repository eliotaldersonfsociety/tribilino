import { getVisitasStats } from "@/app/helpers/getVisitasStats";
import WebAnalyticsClient from "@/components/web-analytics";
import { DashboardLayouts } from "@/components/dashboard-layouts";

export default async function AnalyticsPage() {
  const stats = await getVisitasStats();

  return (
    <DashboardLayouts>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Panel de Análisis Web</h1>
        <WebAnalyticsClient stats={stats} />
      </main>
    </DashboardLayouts>
  );
}
