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
import { cn } from "@/lib/utils";
import {
    Bot,
    CreditCard,
    LayoutDashboard,
    Plus,
    Presentation,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX, ReactNode } from "react";

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

const projects = [
    {
        name: "Project A",
    },
    {
        name: "Project B",
    },
    {
        name: "Project C",
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    const { open } = useSidebar();

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
                        <SidebarMenu>
                            {projects.map((project) => (
                                <SidebarMenuItem key={project.name}>
                                    <SidebarMenuButton asChild>
                                        <div>
                                            <div
                                                className={cn(
                                                    "bg-primary flex size-6 items-center justify-center rounded-sm border text-sm text-white",
                                                    {
                                                        "bg-primary text-white":
                                                            true,
                                                        // 'bg-primary text-foreground' : project.id === project.id,
                                                    }
                                                )}
                                            >
                                                {project.name[0]}
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
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
