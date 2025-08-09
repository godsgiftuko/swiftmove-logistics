import { EUserRole } from '../../../shared/interfaces';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import DriverDashboard from '../components/DriverDashboard';
import ManagerDashboard from '../components/ManagerDashboard';

export default function DashboardPage() {
    const { user  } = useAuth();
    if (user!.role === EUserRole.admin) {
        return <AdminDashboard user={user!} />;
    } else if (user!.role === EUserRole.driver) {
        return <DriverDashboard user={user!} />
    } 
    return <ManagerDashboard user={user!} />
}