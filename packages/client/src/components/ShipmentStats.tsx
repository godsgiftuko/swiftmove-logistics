// src/components/ShipmentStats.tsx
import { Truck, Package, CheckCircle, Clock, XCircle } from "lucide-react";

interface ShipmentStatsProps {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
}

export default function ShipmentStats({
  total,
  pending,
  inTransit,
  delivered,
  cancelled
}: ShipmentStatsProps) {
  const stats = [
    { label: "Total Shipments", value: total, icon: Package, color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: pending, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "In Transit", value: inTransit, icon: Truck, color: "bg-indigo-100 text-indigo-600" },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Cancelled", value: cancelled, icon: XCircle, color: "bg-red-100 text-red-600" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border"
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
