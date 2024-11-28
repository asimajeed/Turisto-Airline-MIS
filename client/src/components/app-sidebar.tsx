import { Calendar, Home, Inbox, Settings } from "lucide-react";
import { useGlobalStore } from "@/context/GlobalStore"; // Update the path as per your project structure
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
    subItems: [{ title: "Update", url: "/user" }],
  },
  {
    title: "Bookings",
    icon: Calendar,
    subItems: [
      { title: "Modify", url: "/user/modify" },
      { title: "Cancel", isCancel: true },
      { title: "History" , url: "/user/history"}
    ],
  },
  {
    title: "Tickets",
    icon: Inbox,
    subItems: [
      { title: "Boarding Pass", url: "/boardingpass" },
      { title: "Ticket", url: "/passengerticket" },
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


function RedeemCode() {
  const loyaltyPoints = useGlobalStore((state) => state.loyalty_points);

  let redeemCode = "";
  if (loyaltyPoints !== null) {
    if (loyaltyPoints>250 && loyaltyPoints < 500) redeemCode = "TUR25";
    else if (loyaltyPoints > 250 && loyaltyPoints < 750) redeemCode = "TUR50";
    else if (loyaltyPoints > 750) redeemCode = "TUR75";
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-medium text-foreground">
        Your Redeem Code:{" "}
        <span className="text-theme-primary-highlight font-semibold">{redeemCode || "Not enough Points"}</span>
      </p>
      {redeemCode && (
        <p className="text-sm text-gray-500">
          Use this code during checkout to redeem your points.
        </p>
      )}
    </div>
  );
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
                                  <SidebarMenuButton>{subItem.title}</SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Redeem Points</DialogTitle>
                                    <DialogDescription>
                                      You can redeem your loyalty points here.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4 space-y-4">
                                    {/* Display Redeem Code */}
                                    <RedeemCode />
                                  </div>
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
