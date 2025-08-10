import { EUserStatus, IUser } from '../../../shared/interfaces';

export default function DriverCard({ user }: { user: IUser }) {
  const getStatusColor = (status: keyof typeof EUserStatus) => {
    switch (status) {
      case EUserStatus.active:
        return "bg-green-100 text-green-800";
      case EUserStatus.inactive:
        return "bg-gray-100 text-gray-800";
      case EUserStatus.suspended:
        return "bg-yellow-100 text-yellow-800";
      case EUserStatus.deleted:
        return "bg-red-100 text-red-800";
      case EUserStatus.busy:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white w-full rounded-lg border border-gray-200 p-6 transition-shadow duration-300">
      <div className='flex justify-between items-center'>
        {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
          <img
                src={'https://static.vecteezy.com/system/resources/previews/004/975/153/non_2x/driver-color-icon-transportation-service-isolated-illustration-vector.jpg'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            {/* Status indicator dot */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
          </div>
          

          {/* Name and Email */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </div>

      {/* Contact Info */}
      <div className="mb-4 space-y-2">
        {user.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-4 h-4 mr-2">📞</span>
            <span>{user.phone}</span>
          </div>
        )}
      </div>


      {/* Stats */}
      <div className="mb-4 flex justify-between items-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Deliveries</div>
          </div>
        
          <div className="text-center">
            <div className="flex justify-center mb-1">
              {renderStars(4)}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
      </div>
      </div>
    </div>
  );
};