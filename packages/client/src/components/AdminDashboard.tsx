import { IUser } from "@/interfaces";
import ShipmentStats from "./ShipmentStats";
import { useState } from "react";
import axios from "axios";
import { API } from "../../../shared/constants";
import toast from "react-hot-toast/headless";
import UserInfoCard from "./UserInfoCard";

export default function AdminDashboard({ user }: { user: IUser }) {
  const { firstName, lastName, role } = user;
  const [shipmentStats, setShipmentStats] = useState({
    total: 0,
    cancelled: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  });

  Promise.all([
    axios.get(`${API.PREFIX}/deliveries/stats`),
  ])
  .then(([deliveryStats]) => {
    console.log({deliveryStats});
  })
  .catch(() => toast.error('Could not load records'))
  return (
    <div>
      <div className="flex flex-col gap-5">
      <UserInfoCard />
      <ShipmentStats
        total={shipmentStats.total}
        cancelled={shipmentStats.cancelled}
        delivered={shipmentStats.delivered}
        inTransit={shipmentStats.inTransit}
        pending={shipmentStats.pending}
      />
      </div>
    </div>
  );
}
