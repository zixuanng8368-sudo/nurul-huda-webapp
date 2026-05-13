import { useEffect, useState } from "react";

import { authClient } from "../lib/auth-client";

const FinanceDashboard = () => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      // No session
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const { data } = await authClient.admin.hasPermission({
        userId: session.user.id,
        permissions: {
          finance: ["view"],
        },
      });
      setHasAccess(data?.success ?? false);
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
