import {
    Paper,
} from "@mui/material";


import {
    useEffect,
    useState,
} from "react";
import {getBills} from "../api/billingApi.js";
import DataTable from "../component/DataTable.jsx";


export default function Billing() {
    const [bills, setBills] =
        useState([]);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        const response =
            await getBills();

        setBills(response.data);
    };

    return (
        <Paper>
            <DataTable
                columns={[
                    "Patient",
                    "Amount",
                    "Status",
                ]}
                rows={bills}
            />
        </Paper>
    );
}