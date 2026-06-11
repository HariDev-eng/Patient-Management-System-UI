import Sidebar from "../component/layout/Sidebar.jsx";
import Navbar from "../component/layout/Navbar.jsx";


export default function MainLayout({
                                       children,
                                   }) {
    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}