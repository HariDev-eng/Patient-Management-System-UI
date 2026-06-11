

export default function Dashboard() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-4 gap-6">

                <StatCard
                    title="Patients"
                    value="1200"
                />

                <StatCard
                    title="Doctors"
                    value="85"
                />

                <StatCard
                    title="Appointments"
                    value="354"
                />

                <StatCard
                    title="Revenue"
                    value="₹120,000"
                />

            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">

                <div className="bg-white rounded-xl p-6 shadow">
                    Recent Appointments
                </div>

                <div className="bg-white rounded-xl p-6 shadow">
                    Low Stock Medicines
                </div>

            </div>
        </>
    );
}