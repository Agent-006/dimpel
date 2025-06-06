"use client";

import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import {
    Bot,
    CreditCard,
    LayoutDashboard,
    Loader2,
    Plus,
    Presentation,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Q&A",
        url: "/qa",
        icon: Bot,
    },
    {
        title: "Meetings",
        url: "/meetings",
        icon: Presentation,
    },
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    const { open } = useSidebar();

    const { projects, projectId, setProjectId, isLoading } = useProject();
    console.log(projects, isLoading, projectId);

    return (
        <Sidebar collapsible="icon" variant="floating" className="mb-6">
            <SidebarHeader>
                {open ? (
                    <h1 className="text-primary/80 text-2xl font-bold">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2"
                        >
                            Dimpel
                        </Link>
                    </h1>
                ) : (
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2"
                    >
                        <h1 className="text-primary/80 text-2xl font-bold">
                            D
                        </h1>
                    </Link>
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn({
                                                "!bg-background":
                                                    pathname === item.url,
                                            })}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="text-primary/80 h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <SidebarMenu>
                                {projects?.map((project) => (
                                    <SidebarMenuItem
                                        className="cursor-pointer"
                                        key={project.name}
                                    >
                                        <SidebarMenuButton asChild>
                                            <div
                                                onClick={() => {
                                                    setProjectId(project.id);
                                                }}
                                            >
                                                <div
                                                    className={cn(
                                                        "text-primary flex size-6 items-center justify-center rounded-sm border text-sm font-semibold",
                                                        {
                                                            "bg-primary text-foreground":
                                                                project.id ===
                                                                projectId,
                                                        }
                                                    )}
                                                >
                                                    {project.name[0]?.toUpperCase()}
                                                </div>
                                                {open && (
                                                    <span>{project.name}</span>
                                                )}
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                <div className="h-2"></div>

                                <SidebarMenuItem
                                    className={cn("", {
                                        "flex justify-center": !open,
                                    })}
                                >
                                    <Link href="/create">
                                        <Button
                                            size="sm"
                                            variant={"outline"}
                                            className="w-fit"
                                        >
                                            <Plus />
                                            {open && "Create Project"}
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
