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
import axios, { AxiosError } from "axios";
import { useState } from "react";

type SubItem =
  | { title: string; url: string }
  | { title: string; isDialog: boolean }
  | { title: string; isCancel: boolean }
  | { title: string; isCheck: boolean };

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
      { title: "History", url: "/user/history" },
    ],
  },
  {
    title: "Tickets",
    icon: Inbox,
    subItems: [
      { title: "Check In", isCheck: true },
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
    if (loyaltyPoints > 250 && loyaltyPoints < 500) redeemCode = "TUR25";
    else if (loyaltyPoints > 250 && loyaltyPoints < 750) redeemCode = "TUR50";
    else if (loyaltyPoints > 750) redeemCode = "TUR75";
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-medium text-foreground">
        Your Redeem Code:{" "}
        <span className="text-theme-primary-highlight font-semibold">
          {redeemCode || "Not enough Points"}
        </span>
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
  const [cancellationId, setCancellationId] = useState<number>();
  const handleSelection = (section: string, subItem: string | null = null) => {
    const path = subItem ? [section, subItem] : [section];
    if (onSelectionChange) onSelectionChange(path);
  };
  const handleCancellation = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_URL}/booking/${cancellationId}`,
        { withCredentials: true }
      );
      alert(
        `${response.data.message}. Refund amount: ${response.data.refund_amount}`
      );
    } catch (error: any) {
      if (error instanceof AxiosError)
        alert(
          `${error.message}. ${error.response?.data.message} ${error.response?.data.error}`
        );
      else console.log(error);
    }
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
                                        type="number"
                                        value={cancellationId}
                                        onChange={(e) =>
                                          setCancellationId(
                                            Number(e.target.value || undefined)
                                          )
                                        }
                                        placeholder="Enter your booking id"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end mt-4 gap-2">
                                    <Button
                                      variant="destructive"
                                      onClick={handleCancellation}
                                    >
                                      Confirm
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : "isCheck" in subItem ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Flight Check-In</DialogTitle>
                                    <DialogDescription>
                                      Please provide the details below to check
                                      in for your flight.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-4">
                                    <div>
                                      <label
                                        htmlFor="checkin-booking-reference"
                                        className="block text-sm font-medium text-gray-200"
                                      >
                                        Booking Reference
                                      </label>
                                      <Input
                                        id="checkin-booking-reference"
                                        type="text"
                                        placeholder="Enter your booking reference"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end mt-4 gap-2">
                                    <Link to="/boardingpass">
                                      <Button className="bg-theme-primary-darker text-white hover:bg-theme-primary-highlight">
                                        Boarding Pass
                                      </Button>
                                    </Link>
                                    <Button variant="default">Check In</Button>
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
