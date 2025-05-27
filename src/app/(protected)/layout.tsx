import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSidebar } from "./app-sidebar";
import { ModeToggle } from "@/components/theme-toggler";

type Props = {
    children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <div className="mb-6">
                <AppSidebar />
            </div>

            <main className="m-2 w-full">
                <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border p-2 px-4 shadow">
                    {/* <SearchBar /> */}
                    <div className="ml-auto"></div>
                    <ModeToggle />
                    <UserButton />
                </div>
                <div className="h-4"></div>
                {/* main content */}
                <div className="border-sidebar-border bg-sidebar h-[calc(100vh-5.5rem)] overflow-y-scroll rounded-md border p-4 shadow">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default SidebarLayout;
