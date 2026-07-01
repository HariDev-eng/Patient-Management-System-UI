import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

export default function PortalLayout({ sidebar: Sidebar, children, greeting }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            background: "#f1f5f9",
        }}>
            <div style={{ height: "100vh", overflowY: "auto" }}>
                <Sidebar />
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
                minWidth: 0,
            }}>
                <Navbar greeting={greeting} />
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    padding: "20px",
                    background: "#f1f5f9",
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
}