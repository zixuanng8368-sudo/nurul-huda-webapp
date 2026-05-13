import { useEffect, useState } from "react";

import { useSession } from "../lib/auth-client";
import { hasPermission } from "../lib/permissions";

const FinanceDashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      // No session
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      // Check if user has finance.view permission
      const access = hasPermission(session.user, "finance", "view");
      setHasAccess(access);
      setLoading(false);
    };
    checkPermission();
  }, [session]);

  // Loading state
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  // Forbidden
  if (!hasAccess) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600">Forbidden</h2>

        <p className="text-gray-600 mt-2">
          You don't have access to this page.
        </p>
      </div>
    );
  }

  // Allowed
  return (
    <div className="p-6">Displaying Financial Dashboard / Content Here</div>
  );
};

export default FinanceDashboard;
