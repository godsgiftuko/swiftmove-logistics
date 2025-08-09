import { API } from '../../../shared/constants';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
    const { user, logoutUser  } = useAuth();
    return (
        <>
        <h1 className='text-4xl font-bold'>{API.NAME} DashboardPage</h1>
        <h6 className='text-md font-bold'>{user!.firstName} && {user!.lastName}</h6>
        <button className='text-red-500' onClick={() => {
            logoutUser();
            
        }}>Logout</button>
        </>
    )
}