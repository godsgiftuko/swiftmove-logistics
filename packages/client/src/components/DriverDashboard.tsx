import { IUser } from "@/interfaces";
import DriverShipmentTable from "./DriverShipmentsTable";
import DriverInfo from "./DriverInfo";

export default function DriverDashboard({ user }: { user: IUser}) {
    return (
        <>
        <DriverInfo user={user} />
        <DriverShipmentTable />
        </>
    )
}