import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/context/GlobalStore";

export function UpdateUser(): JSX.Element {
    const {
        first_name,
        last_name,
        email,
        phone_number,
        date_of_birth,
        setFirstName,
        setLastName,
        setEmail,
        setPhoneNumber,
        setDateOfBirth,
        setLoyaltyPoints,
        setAdminAccess,
        setAll,
    } = useGlobalStore();

    const handleFieldUpdate = (
        field: string,
        value: string | number | boolean | null
    ) => {
        const updateFunctions: Record<string, (value: any) => void> = {
            first_name: (value) => setFirstName(value as string | null),
            last_name: (value) => setLastName(value as string | null),
            email: (value) => setEmail(value as string | null),
            phone_number: (value) => setPhoneNumber(value as string | null),
            date_of_birth: (value) => setDateOfBirth(value as string | null),
            loyalty_points: (value) => setLoyaltyPoints(value !== null ? Number(value) : null),
            is_admin: (value) => setAdminAccess(value as boolean),
            is_guest: (value) => setAll({ is_guest: value as boolean }),
        };

        // Call the appropriate update function if available
        updateFunctions[field]?.(value ?? "");
        alert(`${field.replace("_", " ")} updated successfully!`);
    };

    const fields = [
        { label: "First Name", field: "first_name", value: first_name, type: "text" },
        { label: "Last Name", field: "last_name", value: last_name, type: "text" },
        { label: "Email", field: "email", value: email, type: "email" },
        { label: "Phone Number", field: "phone_number", value: phone_number, type: "tel" },
        { label: "Date of Birth", field: "date_of_birth", value: date_of_birth, type: "date" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br text-foreground p-8 flex justify-center items-center">
            {/* Glass effect container */}
            <div className="w-full max-w-2xl p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
                <h2 className="text-2xl font-bold mb-6">Update User Information</h2>
                <div className="space-y-6">
                    {fields.map(({ label, field, value, type }) => (
                        <div
                            key={field}
                            className="p-4 bg-white/10 rounded-lg shadow-md border border-white/20 flex flex-col gap-4"
                        >
                            <Label htmlFor={field} className="text-sm font-bold">
                                {label}
                            </Label>

                            <div className="flex items-center gap-4">
                                <Input
                                    id={field}
                                    type={type}
                                    value={type !== "checkbox" ? (value !== null ? String(value) : "") : undefined}
                                    checked={type === "checkbox" ? Boolean(value) : undefined}
                                    onChange={(e) =>
                                        handleFieldUpdate(
                                            field,
                                            type === "checkbox"
                                                ? e.target.checked
                                                : type === "number"
                                                    ? +e.target.value
                                                    : e.target.value
                                        )
                                    }
                                    className="flex-1 border border-white/20 text-foreground"
                                />

                                <Button
                                    onClick={() =>
                                        handleFieldUpdate(
                                            field,
                                            type === "checkbox" ? !value : value
                                        )
                                    }
                                    className="w-32"
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
