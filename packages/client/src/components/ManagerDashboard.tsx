import { IUser } from "@/interfaces";

export default function ManagerDashboard({user}: { user: IUser}) {
    const { firstName, lastName, role } = user
    return (
        <>
        <h1>ManagerDashboard</h1>
        <h6 className='text-md font-bold'>{firstName} && {lastName} - {role}</h6>
        </>
    )
}