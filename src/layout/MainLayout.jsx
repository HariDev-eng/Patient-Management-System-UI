import Sidebar from "../component/Sidebar.jsx";
import Navbar from "../component/Navbar.jsx";


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