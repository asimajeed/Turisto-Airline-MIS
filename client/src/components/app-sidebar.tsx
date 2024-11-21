import { Calendar, Home, Inbox, Settings } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";

// Menu items.
const items = [
    {
        title: "Profile",
        icon: Home,
        subItems: [
            { title: "Update", url: "#profile-update" },
            { title: "Preference", url: "#profile-preference" },
        ],
    },
    {
        title: "Bookings",
        icon: Calendar,
        subItems: [
            { title: "Book", url: "#bookings-book" },
            { title: "Track Miles", url: "#bookings-track-miles" },
            { title: "Modify", url: "#bookings-modify" },
            { title: "Cancel", url: "#bookings-cancel" },
        ],
    },
    {
        title: "Tickets",
        icon: Inbox,
        subItems: [
            { title: "Boarding Pass", url: "#tickets-boarding-pass" },
            { title: "Ticket", url: "#tickets-ticket" },
        ],
    },
    {
        title: "Loyalty Program",
        icon: Settings,
        subItems: [
            { title: "View Points", url: "#loyalty-view-points" },
            { title: "Redeem Points", url: "#loyalty-redeem-points" },
        ],
    },
];

type SidebarSelectionCallback = (path: string[]) => void;

interface AppSidebarProps {
    onSelectionChange?: SidebarSelectionCallback;
}

export function AppSidebar({ onSelectionChange }: AppSidebarProps) {
    // Trigger breadcrumb updates on item selection
    const handleSelection = (section: string, subItem: string | null = null) => {
        const path = subItem ? [section, subItem] : [section];
        if (onSelectionChange) onSelectionChange(path);
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>User Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <Collapsible key={index} defaultOpen className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => handleSelection(item.title)}>
                                                <item.icon className="mr-2" />
                                                {item.title}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <SidebarMenuSubItem key={subIndex}>
                                                        <SidebarMenuButton
                                                            onClick={() => handleSelection(item.title, subItem.title)}
                                                        >
                                                            {subItem.title}
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
