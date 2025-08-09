import { useSelector } from 'react-redux';
import { EUserRole } from '../../../shared/interfaces';
import AdminDashboard from '../components/AdminDashboard';
import DriverDashboard from '../components/DriverDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import { RootState } from '../store/store';

export default function DashboardPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    
    if (user!.role === EUserRole.admin) {
        return <AdminDashboard user={user!} />;
    } else if (user!.role === EUserRole.driver) {
        return <DriverDashboard user={user!} />
    } 
    return <ManagerDashboard user={user!} />
}