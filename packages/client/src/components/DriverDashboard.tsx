import { IUser } from "@/interfaces";

export default function DriverDashboard({user}: { user: IUser}) {
    const { firstName, lastName, role } = user
    return (
        <>
        <h1>DriverDashboard</h1>
        <h6 className='text-md font-bold'>{firstName} && {lastName} - {role}</h6>
        </>
    )
}