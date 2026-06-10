import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import MainLayout from "../layout/MainLayout.jsx";
import Patients from "../pages/patients.jsx";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/patients"
                        element={<Patients />}
                    />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
}