import DataTable from "../component/DataTable.jsx";


export default function Patients() {
    const rows = [
        {
            Name: "Hari",
            Email: "hari@gmail.com",
            Phone: "9876543210",
        },
    ];

    return (
        <div>
            <h1 className="text-3xl mb-5">
                Patients
            </h1>

            <DataTable
                columns={[
                    "Name",
                    "Email",
                    "Phone",
                ]}
                rows={rows}
            />
        </div>
    );
}