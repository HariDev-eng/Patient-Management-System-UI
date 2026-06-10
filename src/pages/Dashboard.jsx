import DashboardCard from "../component/DashboardCard.jsx";

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-6">
                <DashboardCard
                    title="Patients"
                    value="1200"
                />

                <DashboardCard
                    title="Doctors"
                    value="85"
                />

                <DashboardCard
                    title="Appointments"
                    value="350"
                />

                <DashboardCard
                    title="Revenue"
                    value="₹120000"
                />
            </div>
        </div>
    );
}