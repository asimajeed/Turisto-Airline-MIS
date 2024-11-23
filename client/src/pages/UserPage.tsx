import { useState } from "react";
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

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  loyaltyPoints: number;
  isAdmin: boolean;
}

interface EditFields {
  [key: string]: string | number;
}

interface IsEditing {
  [key: string]: boolean;
}

export function UserPage(): JSX.Element {
  // const [user, setUser] = useState<User | null>({
  //   firstName: "John",
  //   lastName: "Doe",
  //   email: "john.doe@example.com",
  //   phoneNumber: "123-456-7890",
  //   dateOfBirth: "1990-01-01",
  //   loyaltyPoints: 1500,
  //   isAdmin: false,
  // });

  const [first_name, setFirstName] = useGlobalStore();
  const [last_name, setLastName] = useGlobalStore();

  const [editFields, setEditFields] = useState<EditFields>({});
  const [isEditing, setIsEditing] = useState<IsEditing>({});

  const handleFieldChange = (field: string, value: string | number): void => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateField = (field: string): void => {
    if (user) {
      // Simulate a successful update locally
      setUser((prev) => (prev ? { ...prev, [field]: editFields[field] } : null));
      setIsEditing((prev) => ({ ...prev, [field]: false }));
      alert(`${field} updated successfully!`);
    }
  };

  const toggleEditMode = (field: string): void => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleDeleteUser = (): void => {
    // Simulate user deletion
    alert("User deleted successfully! (This is a frontend simulation)");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br text-white p-8">
        <h2 className="text-2xl font-bold">User account deleted.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br max-h-full max-w-full text-white p-8">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Column */}
        <div className="lg:col-span-1 h-full">
          <div className="p-6 bg-white/10 h-full rounded-xl shadow-lg backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-bold mb-4">User Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {first_name} {last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phoneNumber || "Not provided"}</p>
              <p><strong>Date of Birth:</strong> {user.dateOfBirth || "Not provided"}</p>
              <p><strong>Loyalty Points:</strong> {user.loyaltyPoints}</p>
              <p><strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}</p>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "First Name", field: "firstName", type: "text" },
              { label: "Last Name", field: "lastName", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Phone Number", field: "phoneNumber", type: "tel" },
              { label: "Date of Birth", field: "dateOfBirth", type: "date" },
            ].map(({ label, field, type }) => (
              <div
                key={field}
                className="p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20"
              >
                <Label htmlFor={field} className="block text-sm font-bold mb-2">
                  {label}
                </Label>
                {isEditing[field] ? (
                  <>
                    <Input
                      type={type}
                      id={field}
                      value={editFields[field] ?? user[field]}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="bg-zinc-900 border border-white/20 text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="default"
                        onClick={() => handleUpdateField(field)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleEditMode(field)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <p>{user[field] || "Not provided"}</p>
                    <Button
                      variant="outline"
                      onClick={() => toggleEditMode(field)}
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      <div className="mt-8 p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
        <h3 className="text-xl font-bold mb-4">FAQs</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Can a deleted user be recovered?</AccordionTrigger>
            <AccordionContent>
              Once a user is deleted, recovery depends on whether a backup exists. If no backup is available, the data cannot be recovered.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What happens to the user's data after deletion?</AccordionTrigger>
            <AccordionContent>
              The user's data is typically removed from the active database. However, it may remain in backups or logs for compliance or auditing purposes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can a user be deleted without admin privileges?</AccordionTrigger>
            <AccordionContent>
              No, deleting a user generally requires admin privileges to ensure security and prevent unauthorized actions.
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
                Deleting your account will remove all your data. This action cannot be undone.
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
