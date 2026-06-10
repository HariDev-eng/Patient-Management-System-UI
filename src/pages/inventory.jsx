import {
    Paper,
} from "@mui/material";


import {
    useEffect,
    useState,
} from "react";
import DataTable from "../component/DataTable.jsx";
import {getInventoryItems} from "../api/inventoryApi.js";

export default function Inventory() {
    const [items, setItems] =
        useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const response =
            await getInventoryItems();

        setItems(response.data);
    };

    return (
        <Paper>
            <DataTable
                columns={[
                    "Name",
                    "Quantity",
                    "Price",
                ]}
                rows={items}
            />
        </Paper>
    );
}