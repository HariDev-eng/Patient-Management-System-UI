import {
    Button,
    Paper,
} from "@mui/material";

import { useEffect, useState } from "react";
import {getDoctors} from "../api/doctorApi.js";
import DataTable from "../component/DataTable.jsx";


export default function Doctors() {
    const [doctors, setDoctors] =
        useState([]);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        const response =
            await getDoctors();

        setDoctors(response.data);
    };

    return (
        <div>
            <div className="flex justify-between mb-5">
                <h1 className="text-3xl">
                    Doctors
                </h1>

                <Button
                    variant="contained"
                >
                    Add Doctor
                </Button>
            </div>

            <Paper>
                <DataTable
                    columns={[
                        "First Name",
                        "Last Name",
                        "Email",
                    ]}
                    rows={doctors}
                />
            </Paper>
        </div>
    );
}