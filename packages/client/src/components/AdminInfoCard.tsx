import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { User, Phone, Calendar } from "lucide-react";
import DateUtils from "../../../shared/utils/date";
import { APP_LOGO } from "../../../shared/constants";

export default function AdminInfoCard() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border text-center">
        <p className="text-gray-500">No user information available.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between p-6 bg-white rounded-xl shadow-lg text-[#181818]">
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <User className="text-[#cf1112]" size={32} />
          </div>

          {/* Name & Email */}
          <div>
            <h2 className="text-xl font-bold">{user.firstName}</h2>
            <h2 className="text-xl font-bold">{user.lastName}</h2>
            <p className="text-sm opacity-80">{user.email}</p>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Phone size={18} />
            <span>{user.phone || "No phone number"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Joined: {DateUtils.readableDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
      <img
            src={APP_LOGO.TRANSPARENT}
            alt="Profile"
            className="md:h-50 h-20"
          />
    </div>
  );
}
