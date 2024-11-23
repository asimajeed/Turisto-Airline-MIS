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

export function Update(): JSX.Element {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    loyalty_points,
    is_admin,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setDateOfBirth,
    setLoyaltyPoints,
    setAll,
  } = useGlobalStore();

  const handleFieldChange = (field: string, value: string | number): void => {
    const updateFunctions: Record<string, (value: any) => void> = {
      first_name: (value) => setFirstName(value as string | null),
      last_name: (value) => setLastName(value as string | null),
      email: (value) => setEmail(value as string | null),
      phoneNumber: (value) => setPhoneNumber(value as string | null),
      dateOfBirth: (value) => setDateOfBirth(value as string | null),
      loyalty_points: (value) => setLoyaltyPoints(Number(value)),
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

  if (!first_name && !last_name) {
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
                {date_of_birth || "Not provided"}
              </p>
              <p>
                <strong>Loyalty Points:</strong> {loyalty_points || 0}
              </p>
              <p>
                <strong>Role:</strong> {is_admin ? "Admin" : "User"}
              </p>
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
                value: first_name,
                type: "text",
              },
              {
                label: "Last Name",
                field: "last_name",
                value: last_name,
                type: "text",
              },
              { label: "Email", field: "email", value: email, type: "email" },
              {
                label: "Phone Number",
                field: "phoneNumber",
                value: phone_number,
                type: "tel",
              },
              {
                label: "Date of Birth",
                field: "dateOfBirth",
                value: date_of_birth,
                type: "date",
              },
              {
                label: "Loyalty Points",
                field: "loyaltyPoints",
                value: loyalty_points,
                type: "number",
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
                  value={value || ""}
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