import { useState, useSyncExternalStore } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../components/shared/Navbar/Navbar";
import SidebarList from "../../components/shared/Sidebar/SidebarList/SidebarList";
import Footer from "../../components/shared/Footer/Footer";

const MainLayout = () => {
    const [openSideBar, setOpenSideBar] = useState<boolean>(true);

    useSyncExternalStore(
        (listener) => {
            window.addEventListener("resize", () => {
                if (window !== undefined) {
                    if (window.innerWidth > 520) {
                        setOpenSideBar(true);
                    } else {
                        setOpenSideBar(false);
                    }
                }
            });

            return () => window.removeEventListener("resize", listener);
        },
        () => window.innerWidth
    );

    return (
        <>
            <Navbar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <aside
                className={`w-72 fixed top-0 left-0 z-40  h-screen pt-[65px] duration-500 transition-all bg-white border-r border-gray-200 ${
                    openSideBar ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-full px-3 pt-4 pb-4 overflow-y-auto bg-white">
                    <SidebarList />
                </div>
            </aside>

            <section
                className={`lg:pr-4 lg:pl-12 md:pl-4 pl-4 lg:ml-64 md:ml-0 ml-0 pt-20`}
            >
                <div className={`px-5 py-5`}>
                    <Outlet />
                </div>
                <Footer />
            </section>
        </>
    );
};

export default MainLayout;
