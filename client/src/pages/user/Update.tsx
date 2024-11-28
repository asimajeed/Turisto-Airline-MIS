import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/context/GlobalStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export function Update(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const {
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    loyalty_points,
    is_admin,
    setAll,
  } = useGlobalStore();
  const [new_first_name, setFirstName] = useState(first_name);
  const [new_last_name, setLastName] = useState(last_name);
  const [new_email, setEmail] = useState(email);
  const [new_phone_number, setPhoneNumber] = useState(phone_number);
  const [new_date_of_birth, setDateOfBirth] = useState(date_of_birth);
  const handleFieldChange = (field: string, value: string | number): void => {
    const updateFunctions: Record<string, (value: any) => void> = {
      first_name: (value) => setFirstName(value as string | null),
      last_name: (value) => setLastName(value as string | null),
      email: (value) => setEmail(value as string | null),
      phoneNumber: (value) => setPhoneNumber(value as string | null),
      dateOfBirth: (value) => setDateOfBirth(value as Date | null),
    };
    updateFunctions[field]?.(value);
  };

  const handleDeleteUser = (): void => {
    alert("User deleted successfully! (This is a frontend simulation)");
    setAll({
      first_name: null,
      last_name: null,
      email: null,
      phone_number: null,
      date_of_birth: null,
      loyalty_points: null,
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        first_name: new_first_name,
        last_name: new_last_name,
        email: new_email,
        phone_number: new_phone_number,
        date_of_birth: new_date_of_birth,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/update`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("User information updated successfully!");
        setAll(payload);
      } else {
        alert(`Failed to update user information. Status: ${response.status}`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Update failed"}`);
      } else if (error.request) {
        alert("No response received from the server. Please try again later.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (!new_email) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br text-foreground p-8">
        <h2 className="text-2xl font-bold">User account deleted.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br max-h-full w-full text-foreground p-8">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          <div className="p-6 bg-white/10 h-full rounded-xl shadow-lg backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-bold mb-4">User Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {first_name} {last_name}
              </p>
              <p>
                <strong>Email:</strong> {email || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong> {phone_number || "Not provided"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {date_of_birth?.toLocaleDateString() || "Not provided"}
              </p>
              <p>
                <strong>Loyalty Points:</strong> {loyalty_points || 0}
              </p>
              {is_admin ? (
                <p>
                  <strong>Role:</strong> Admin
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "First Name",
                field: "first_name",
                value: new_first_name,
                type: "text",
              },
              {
                label: "Last Name",
                field: "last_name",
                value: new_last_name,
                type: "text",
              },
              {
                label: "Email",
                field: "email",
                value: new_email,
                type: "email",
              },
              {
                label: "Phone Number",
                field: "phoneNumber",
                value: new_phone_number,
                type: "tel",
              },
              {
                label: "Date of Birth",
                field: "dateOfBirth",
                value: new_date_of_birth,
                type: "date",
              },
            ].map(({ label, field, value, type }) => (
              <div
                key={field}
                className="p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20"
              >
                <Label htmlFor={field} className="block text-sm font-bold mb-2">
                  {label}
                </Label>
                <Input
                  type={type}
                  id={field}
                  value={
                    value instanceof Date ? value.toISOString() : value || ""
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      field,
                      type === "number" ? +e.target.value : e.target.value
                    )
                  }
                  className="border border-white/20 text-foreground"
                />
              </div>
            ))}
            <div className="p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Button onClick={handleUpdate}>
                {loading ? (
                  <>
                    <FaSpinner className="text-theme-primary animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      <div className="mt-8 p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
        <h3 className="text-xl font-bold mb-4">FAQs</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Can a deleted user be recovered?
            </AccordionTrigger>
            <AccordionContent>
              Once a user is deleted, recovery depends on whether a backup
              exists. If no backup is available, the data cannot be recovered.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              What happens to the user's data after deletion?
            </AccordionTrigger>
            <AccordionContent>
              The user's data is typically removed from the active database.
              However, it may remain in backups or logs for compliance or
              auditing purposes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can a user be deleted without admin privileges?
            </AccordionTrigger>
            <AccordionContent>
              No, deleting a user generally requires admin privileges to ensure
              security and prevent unauthorized actions.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Delete User Section */}
      <div className="mt-8">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Deleting your account will remove all your data. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
