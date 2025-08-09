import { IDeliveryStats, IUser, IUserStats } from "@/interfaces";
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
  const [userStats, setUserStats] = useState({
    total: 0,
    driver: 0,
    admin: 0,
    manager: 0,
  });
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
      api.get(`${API.PREFIX}/users/stats`),
    ])
  .then(([deliveryStats, userStats]) => {
    const stats = deliveryStats.data.data as IDeliveryStats;
    if (stats) {
      const { statusCount } = stats;
      setDeliveryStats(statusCount);
      // setPriorityStats(priorityCount);
    }

    const stats2 = userStats.data.data as IUserStats;
    if (stats2) {
      setUserStats(stats2);
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
      <div className="flex flex-col gap-5">
      <AdminInfoCard />
      <ShipmentStats
        total={deliveryStats.total}
        cancelled={deliveryStats.cancelled}
        delivered={deliveryStats.delivered}
        inTransit={deliveryStats.inTransit}
        pending={deliveryStats.pending}
      />
      <UserStats
        total={userStats.total}
        admin={userStats.admin}
        driver={userStats.driver}
        manager={userStats.manager}
      />
      </div>
    </div>
  );
}
