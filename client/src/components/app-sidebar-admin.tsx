import { Users, ClipboardList, Plane, BarChart2, Database } from "lucide-react";
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
  | { title: string; isDeleteUser: boolean }
  | { title: string; isDeleteFlight: boolean }
  | { title: string; isDeleteBooking: boolean };

type MenuItem = {
  title: string;
  icon: React.ComponentType;
  subItems: SubItem[];
};

const items: MenuItem[] = [
  {
    title: "Manage User",
    icon: Users,
    subItems: [
      { title: "Add", url: "/admin" },
      { title: "Update", url: "/admin/update" },
      { title: "Delete", isDeleteUser: true },
    ],
  },
  {
    title: "Bookings",
    icon: ClipboardList,
    subItems: [
      { title: "UpdateBooking", url: "/admin/updateBook" },
      { title: "Delete", isDeleteBooking: true },
    ],
  },
  {
    title: "System",
    icon: Plane,
    subItems: [
      { title: "Create Flights", url: "/admin/createflight" },
      { title: "Delete Flights", isDeleteFlight: true },
      { title: "Edit Flights", url: "/admin/editflight" },
    ],
  },
  {
    title: "Report Generation",
    icon: BarChart2,
    subItems: [{ title: "Generate Reports", url: "/admin/report" }],
  },
  {
    title: "Database",
    icon: Database,
    subItems: [{ title: "Manage", url: "/admin/sql" }],
  },
];

export function AppSidebarAdmin() {
  const [deleteFlightID, setDeleteFlightID] = useState("");
  const [message, setMessage] = useState<string | JSX.Element | null>(null);
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
                      <SidebarMenuButton>
                        <item.icon />
                        {item.title}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            {"isDeleteUser" in subItem ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete User</DialogTitle>
                                    <DialogDescription>
                                      Enter the user's email to delete their
                                      account.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Input
                                    type="email"
                                    placeholder="Enter user email"
                                    className="my-4"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button variant="destructive">
                                      Delete User
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : "isDeleteBooking" in subItem ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Booking</DialogTitle>
                                    <DialogDescription>
                                      Enter the booking reference to delete the
                                      booking.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Input
                                    type="text"
                                    placeholder="Enter booking reference"
                                    className="my-4"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button variant="destructive">
                                      Delete Booking
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : "isDeleteFlight" in subItem ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Flight</DialogTitle>
                                    <DialogDescription>
                                      Enter the flight reference
                                      number(flight_id) to delete the flight.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Input
                                    type="number"
                                    value={deleteFlightID}
                                    onChange={(e) =>
                                      setDeleteFlightID(e.target.value)
                                    }
                                    placeholder="Enter flight reference number"
                                    className="my-4"
                                  />
                                  {message}
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="destructive"
                                      onClick={async () => {
                                        try {
                                          const response = await axios.delete(
                                            `${
                                              import.meta.env
                                                .VITE_BACKEND_API_URL
                                            }/api/flights/delete/${deleteFlightID}`,
                                            { withCredentials: true }
                                          );
                                          setMessage(
                                            <p className="text-green-600 overflow-auto">
                                              Flight deleted successfully.
                                              Response: {response.data.message}
                                            </p>
                                          );
                                        } catch (err: any) {
                                          if (err instanceof AxiosError)
                                            setMessage(
                                              <p className="text-red-600 overflow-auto">
                                                Error: {err.message}.
                                                {err.response
                                                  ? ` Response:
                                                ${err.response?.data.message}`
                                                  : null}
                                              </p>
                                            );
                                          else
                                            setMessage(
                                              <p className="text-red-600 overflow-auto">
                                                Deletion Failed.
                                              </p>
                                            );
                                        }
                                      }}
                                    >
                                      Delete Flight
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Link to={subItem.url!}>
                                <SidebarMenuButton>
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
