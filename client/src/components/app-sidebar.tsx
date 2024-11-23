import { Calendar, Home, Inbox, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type SubItem =
  | { title: string; url: string }
  | { title: string; isDialog: boolean }
  | { title: string; isCancel: boolean };

type MenuItem = {
  title: string;
  icon: React.ComponentType;
  subItems: SubItem[];
};

const items: MenuItem[] = [
  {
    title: "Profile",
    icon: Home,
    subItems: [{ title: "Update", url: "/user/update" }],
  },
  {
    title: "Bookings",
    icon: Calendar,
    subItems: [
      { title: "Modify", url: "/user/modify" },
      { title: "Cancel", isCancel: true },
    ],
  },
  {
    title: "Tickets",
    icon: Inbox,
    subItems: [
      { title: "Boarding Pass", url: "/boardingpass" },
      { title: "Ticket", url: "/user/ticket" },
    ],
  },
  {
    title: "Loyalty Program",
    icon: Settings,
    subItems: [{ title: "Redeem Points", isDialog: true }],
  },
];

type SidebarSelectionCallback = (path: string[]) => void;

interface AppSidebarProps {
  onSelectionChange?: SidebarSelectionCallback;
}

export function AppSidebar({ onSelectionChange }: AppSidebarProps) {
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
                <Collapsible
                  key={index}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => handleSelection(item.title)}
                      >
                        <item.icon />
                        {item.title}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            {"isDialog" in subItem ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Redeem Points</DialogTitle>
                                    <DialogDescription>
                                      You can redeem your loyalty points here.
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            ) : "isCancel" in subItem ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Cancel Booking</DialogTitle>
                                    <DialogDescription>
                                      Please provide the details below to cancel
                                      your booking.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-4">
                                    <div>
                                      <label
                                        htmlFor="cancel-booking-reference"
                                        className="block text-sm font-medium text-gray-200"
                                      >
                                        Booking Reference
                                      </label>
                                      <Input
                                        id="cancel-booking-reference"
                                        type="text"
                                        placeholder="Enter your booking reference"
                                      />
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="cancel-passenger-name"
                                        className="block text-sm font-medium text-gray-200"
                                      >
                                        Passenger Name
                                      </label>
                                      <Input
                                        id="cancel-passenger-name"
                                        type="text"
                                        placeholder="Enter passenger name"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end mt-4 gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button variant="destructive">
                                      Confirm
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Link to={subItem.url!}>
                                <SidebarMenuButton
                                  onClick={() =>
                                    handleSelection(item.title, subItem.title)
                                  }
                                >
                                  {subItem.title}
                                </SidebarMenuButton>
                              </Link>
                            )}
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
