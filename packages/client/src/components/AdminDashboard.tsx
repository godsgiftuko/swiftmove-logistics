import { IUser } from "@/interfaces";

export default function AdminDashboard({user}: { user: IUser}) {
    const { firstName, lastName, role } = user
    return (
        <>
        <h1>AdminDashboard</h1>
        <h6 className='text-md font-bold'>{firstName} && {lastName} - {role}</h6>
        </>
    )
}