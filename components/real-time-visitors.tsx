"use client";

import { useEffect, useState } from "react";
import { getActiveUsersLocal } from "@/app/helpers/getActiveUsersLocal";
import { getPageViewsLocal } from "@/app/helpers/getPageViewsLocal";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Users } from "lucide-react";

export default function RealTimeVisitorsLocal() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    const update = () => {
      setActiveUsers(getActiveUsersLocal());
      setPageViews(getPageViewsLocal());
    };

    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="pt-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="mr-4">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                {activeUsers}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-500">Usuarios activos ahora</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4">
              <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">{pageViews}</h3>
              <p className="text-sm text-green-600 dark:text-green-500">Vistas de página / min</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
