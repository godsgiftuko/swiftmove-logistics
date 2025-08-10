import { IUserStats } from "@/interfaces";
import { UserCircle, UserCircle2 } from "lucide-react";
import api from "../lib/api";
import { useEffect, useState } from "react";
import { API } from "../../../shared/constants";
import toast from "react-hot-toast";
import ButtonLoader from "./ButtonLoader";

export default function UserStats() {
  const [isLoading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Users", value: 0, icon: UserCircle2, color: "bg-blue-100 text-blue-600" },
    { label: "Admin", value: 0, icon: UserCircle, color: "bg-green-100 text-green-600" },
    { label: "Managers", value: 0, icon: UserCircle, color: "bg-red-100 text-red-600" },
    { label: "Drivers", value: 0, icon: UserCircle, color: "bg-yellow-100 text-yellow-600" }
  ]);

  useEffect(() => {
    const fetchDeliveryStats = () => api.get(`${API.PREFIX}/users/stats`)
  .then((userStats) => {
    const _stats = userStats.data.data as IUserStats;
    if (_stats) {
      setStats((prev) => {
        return prev.map((e) => {
          if (_stats.total && e.label === 'Total Users') {
            e.value = _stats.total;
          }
          if (_stats.admin && e.label === 'Admin') {
            e.value = _stats.admin;
          }
          if (_stats.manager && e.label === 'Managers') {
            e.value = _stats.manager;
          }
          if (_stats.driver && e.label === 'Drivers') {
            e.value = _stats.driver;
          }
          return e;
        }).filter((e) => e.value);
      });
      setLoading(false);
    }
  })
  .catch(() => toast.error('Could not load records'));
    fetchDeliveryStats();
  }, []);

  if (isLoading) {
    return (
      <div
      className="flex justify-center gap-4 p-4 bg-white rounded-xl shadow-sm"
    >
      <span>Fetching users stats</span>
      <ButtonLoader />
    </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
        >
          <div className={`p-3 rounded-full ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
