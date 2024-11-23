import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavigationBar";
import { useRef, useEffect } from "react";

export default function SDALayout() {
    const mainRef = useRef<HTMLDivElement>(null);
    const navBarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (mainRef.current && navBarRef.current) {
                const width = mainRef.current.clientWidth;
                navBarRef.current.style.width = `${width}px`;
            }
        };

        updateWidth();

        const resizeObserver = new ResizeObserver(updateWidth);
        if (mainRef.current) {
            resizeObserver.observe(mainRef.current);
        }

        return () => {
            if (mainRef.current) {
                resizeObserver.unobserve(mainRef.current);
            }
        };
    }, []);

    return (
        <SidebarProvider>
            <AppSidebarAdmin />
            <main ref={mainRef} className="w-full">
                <NavBar ref={navBarRef} className={`transition-none bg-background`}>
                    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1 className="font-bold text-lg">Admin Management</h1>
                    </div>
                </NavBar>
                <div className="pt-32">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </SidebarProvider>
    );
}
