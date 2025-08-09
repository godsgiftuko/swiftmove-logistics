import AdminAuth from "../components/AdminAuth";
import Auth from "../components/Auth";
import { useLocation } from "react-router-dom"

export default function AuthPage() {
    const location = useLocation();
    if (location.pathname === '/admin') {
        return <AdminAuth />
    }
    return <Auth />
}