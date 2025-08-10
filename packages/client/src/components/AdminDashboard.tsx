import { IDeliveryStats, IUser, IUserStats } from "../../../shared/interfaces";
import ShipmentStats from "./ShipmentStats";
import { useEffect, useState } from "react";
import { API } from "../../../shared/constants";
import toast from "react-hot-toast/headless";
import AdminInfoCard from "./AdminInfoCard";
import UserStats from "./UserStats";
import Loader from "./Loader";
import api from "../lib/api";

export default function AdminDashboard({ user }: { user: IUser }) {
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryStats, setDeliveryStats] = useState({
    total: 0,
    cancelled: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  });

  // const [priorityStats, setPriorityStats] = useState({
  //     low: 0,
  //     medium: 0,
  //     high: 0,
  //   });


  useEffect(() => {
    const fetchDeliveryStats = () =>Promise.all([
      api.get(`${API.PREFIX}/deliveries/stats`),
    ])
  .then(([deliveryStats]) => {
    const stats = deliveryStats.data.data as IDeliveryStats;
    if (stats) {
      const { statusCount } = stats;
      setDeliveryStats(statusCount);
      // setPriorityStats(priorityCount);
    }
  })
  .catch(() => toast.error('Could not load records')).finally(() => setIsLoading(false));
    fetchDeliveryStats();
  }, [isLoading]);

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>
      <span className="hidden">{user.firstName}</span>
      <div className="flex flex-col gap-5">
      <AdminInfoCard />
      <ShipmentStats
        total={deliveryStats.total}
        cancelled={deliveryStats.cancelled}
        delivered={deliveryStats.delivered}
        inTransit={deliveryStats.inTransit}
        pending={deliveryStats.pending}
      />
      <UserStats />
      </div>
    </div>
  );
}
