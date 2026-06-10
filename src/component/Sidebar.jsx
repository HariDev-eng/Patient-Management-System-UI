import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";

import { Link } from "react-router-dom";

const menu = [
    {
        label: "Dashboard",
        path: "/",
    },
    {
        label: "Patients",
        path: "/patients",
    },
    {
        label: "Doctors",
        path: "/doctors",
    },
    {
        label: "Appointments",
        path: "/appointments",
    },
    {
        label: "Billing",
        path: "/billing",
    },
    {
        label: "Inventory",
        path: "/inventory",
    },
];

export default function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 250,
            }}
        >
            <List>
                {menu.map((item) => (
                    <ListItemButton
                        key={item.label}
                        component={Link}
                        to={item.path}
                    >
                        <ListItemText
                            primary={item.label}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}