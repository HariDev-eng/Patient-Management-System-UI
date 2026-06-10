import {
    Button,
    Paper,
} from "@mui/material";

import { useEffect, useState } from "react";
import {getAppointments} from "../api/appointmentApi.js";
import DataTable from "../component/DataTable.jsx";


export default function Appointments() {
    const [appointments,
        setAppointments] =
        useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const response =
            await getAppointments();

        setAppointments(
            response.data
        );
    };

    return (
        <div>
            <div className="flex justify-between mb-5">
                <h1 className="text-3xl">
                    Appointments
                </h1>

                <Button
                    variant="contained"
                >
                    Schedule
                </Button>
            </div>

            <Paper>
                <DataTable
                    columns={[
                        "Patient",
                        "Doctor",
                        "Status",
                        "Date",
                    ]}
                    rows={appointments}
                />
            </Paper>
        </div>
    );
}