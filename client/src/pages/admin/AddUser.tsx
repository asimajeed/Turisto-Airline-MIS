import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/context/GlobalStore";

export function AddUser(): JSX.Element {
    const {
        first_name,
        last_name,
        email,
        phone_number,
        date_of_birth,
        is_admin,
        is_guest,
        setFirstName,
        setLastName,
        setEmail,
        setPhoneNumber,
        setDateOfBirth,
        setLoyaltyPoints,
        setAdminAccess,
        setAll,
        resetUserFields,
    } = useGlobalStore();

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        const updateFunctions: Record<string, (value: any) => void> = {
            first_name: (value) => setFirstName(value as string | null),
            last_name: (value) => setLastName(value as string | null),
            email: (value) => setEmail(value as string | null),
            phone_number: (value) => setPhoneNumber(value as string | null),
            date_of_birth: (value) => setDateOfBirth(value as string | null),
            loyalty_points: (value) => setLoyaltyPoints(Number(value)),
            is_admin: (value) => setAdminAccess(value as boolean),
            is_guest: (value) => setAll({ is_guest: value as boolean }),
        };
        updateFunctions[field]?.(value);
    };

    const handleAddUser = () => {
        if (!first_name || !last_name || !email) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            // Simulating a backend API call
            alert("User added successfully! (This is a frontend simulation)");

            // Reset user fields
            resetUserFields();
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br text-foreground p-8 flex justify-center items-center">
            <div className="w-full max-w-xl p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
                <h2 className="text-2xl font-bold mb-6">Add New User</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddUser();
                    }}
                    className="space-y-4"
                >
                    {[
                        { label: "First Name", field: "first_name", value: first_name, type: "text" },
                        { label: "Last Name", field: "last_name", value: last_name, type: "text" },
                        { label: "Email", field: "email", value: email, type: "email" },
                        { label: "Phone Number", field: "phone_number", value: phone_number, type: "tel" },
                        { label: "Date of Birth", field: "date_of_birth", value: date_of_birth, type: "date" },
                        
                    ].map(({ label, field, value, type }) => (
                        <div key={field}>
                            <Label htmlFor={field} className="block text-sm font-bold mb-2">
                                {label}
                            </Label>
                            <Input
                                id={field}
                                type={type}
                                value={value || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        field,
                                        type === "number" ? +e.target.value : e.target.value
                                    )
                                }
                                className="border border-white/20 text-foreground w-full"
                                required={field !== "phone_number" && field !== "date_of_birth"}
                            />
                        </div>
                    ))}

                    {/* Admin and Guest Toggles */}
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="is_admin" className="flex items-center space-x-2">
                            <Input
                                id="is_admin"
                                type="checkbox"
                                checked={is_admin}
                                onChange={(e) => handleFieldChange("is_admin", e.target.checked)}
                            />
                            <span>Admin</span>
                        </Label>
                        <Label htmlFor="is_guest" className="flex items-center space-x-2">
                            <Input
                                id="is_guest"
                                type="checkbox"
                                checked={is_guest}
                                onChange={(e) => handleFieldChange("is_guest", e.target.checked)}
                            />
                            <span>Guest</span>
                        </Label>
                    </div>

                    <Button type="submit" className="w-full">
                        Add User
                    </Button>
                </form>
            </div>
        </div>
    );
}
