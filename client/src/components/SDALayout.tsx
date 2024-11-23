import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavigationBar";

export default function SDALayout() {
    return (
        <SidebarProvider>
            <AppSidebarAdmin />
            <main className="w-full">
                <NavBar className="transition-none bg-background">
                    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1 className="font-bold text-lg">Admin Management</h1>
                    </div>
                </NavBar>
                <div className="pt-28">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </SidebarProvider>
    );
}
