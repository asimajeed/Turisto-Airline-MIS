import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AddUser(): JSX.Element {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null); // Added password state

  const handleAddUser = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      date_of_birth: dateOfBirth,
      is_admin: isAdmin,
      is_guest: isGuest,
      password, // Added password field
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/user`,
        newUser
      ); // Adjust the URL to match your API endpoint
      alert("User added successfully!");
      console.log("Response:", response.data);

      // Reset fields
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setPhoneNumber(null);
      setDateOfBirth(null);
      setIsAdmin(false);
      setIsGuest(false);
      setPassword(null); // Reset password field
    } catch (error) {
      if (error instanceof AxiosError)
        alert(
          `Failed to add user. ${error.message} Response: ${error.response?.data.message}`
        );
      else {
        console.error("Error adding user:", error);
        alert("Failed to add user.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-card text-foreground p-8 flex justify-center items-center">
      <div className="w-full max-w-xl p-6 bg-card rounded-xl shadow-lg backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Add New User
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
          className="space-y-6"
        >
          {[
            {
              label: "First Name",
              value: firstName,
              onChange: setFirstName,
              type: "text",
              placeholder: "Enter first name",
            },
            {
              label: "Last Name",
              value: lastName,
              onChange: setLastName,
              type: "text",
              placeholder: "Enter last name",
            },
            {
              label: "Email",
              value: email,
              onChange: setEmail,
              type: "email",
              placeholder: "Enter email address",
            },
            {
              label: "Phone Number",
              value: phoneNumber,
              onChange: setPhoneNumber,
              type: "tel",
              placeholder: "Enter phone number",
            },
            {
              label: "Date of Birth",
              value: dateOfBirth,
              onChange: (value: string) => {
                setDateOfBirth(new Date(value));
              },
              type: "date",
              placeholder: "Select date of birth",
            },
            {
              label: "Password", // New password field
              value: password,
              onChange: setPassword,
              type: "password",
              placeholder: "Enter password", // Placeholder for password field
            },
          ].map(({ label, value, onChange, type, placeholder }, idx) => (
            <div key={idx}>
              <Label
                htmlFor={label.toLowerCase().replace(" ", "_")}
                className="block text-sm font-bold text-foreground mb-2"
              >
                {label}
              </Label>
              <Input
                id={label.toLowerCase().replace(" ", "_")}
                type={type}
                value={
                  value instanceof Date
                    ? value.toISOString().split("T")[0]
                    : value || ""
                }
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="border border-white/20 text-foreground w-full rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                required={label !== "Phone Number" && label !== "Date of Birth"}
              />
            </div>
          ))}

          {/* Admin and Guest Toggles */}
          <div className="flex items-center space-x-4">
            <Label
              htmlFor="is_admin"
              className="flex items-center space-x-2 text-foreground"
            >
              <Input
                id="is_admin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded-md"
              />
              <span>Admin</span>
            </Label>
            <Label
              htmlFor="is_guest"
              className="flex items-center space-x-2 text-foreground"
            >
              <Input
                id="is_guest"
                type="checkbox"
                checked={isGuest}
                onChange={(e) => setIsGuest(e.target.checked)}
                className="rounded-md"
              />
              <span>Guest</span>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg mt-4"
          >
            Add User
          </Button>
        </form>
      </div>
    </div>
  );
}