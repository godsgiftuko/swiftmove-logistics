import { IUserStats } from "@/interfaces";
import { Truck, Package, UserCircle, UserCircle2 } from "lucide-react";

export default function UserStats({
  total,
  admin,
  driver,
  manager
}: IUserStats) {
  const stats = [
    { label: "Total Users", value: total, icon: Package, color: "bg-blue-100 text-blue-600" },
    { label: "Admin", value: admin, icon: UserCircle, color: "bg-indigo-100 text-indigo-600" },
    { label: "Managers", value: manager, icon: UserCircle2, color: "bg-green-100 text-green-600" },
    { label: "Driver", value: driver, icon: Truck, color: "bg-red-100 text-red-600" }
  ];

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
