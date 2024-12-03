import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function UpdateUser(): JSX.Element {
  const [userId, setUserId] = useState<string | null>(null); // User ID input state
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/user/${userId}`,
        { withCredentials: true }
      );
      const userData = response.data;
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setPhoneNumber(userData.phone_number);
      setDateOfBirth(new Date(userData.date_of_birth));
      setIsAdmin(userData.is_admin);
      setIsGuest(userData.is_guest);
    } catch (error) {
      if (error instanceof AxiosError)
        alert(
          `Failed to fetch user data.  ${error.message} Response: ${error.response?.data.message}`
        );
      else {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      }
    }
  };
  // Fetch user data when userId is provided
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleUpdateUser = async () => {
    if (!firstName || !lastName || !email || !userId) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      date_of_birth: dateOfBirth,
      is_admin: isAdmin,
      is_guest: isGuest,
      password,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/user/${userId}`,
        updatedUser,
        { withCredentials: true }
      );
      alert("User updated successfully!");
      const userData = response.data.user;
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setPhoneNumber(userData.phone_number);
      setDateOfBirth(new Date(userData.date_of_birth)); // Ensure this is parsed as Date
      setIsAdmin(userData.is_admin);
      setIsGuest(userData.is_guest);
      setPassword(""); // Optional: clear the password field or leave it as is if not updating
    } catch (error) {
      if (error instanceof AxiosError)
        alert(
          `Failed to update user. ${error.message} Response: ${error.response?.data.message}`
        );
      else {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-card text-foreground p-8 flex justify-center items-center">
      <div className="w-full max-w-xl p-6 bg-card rounded-xl shadow-lg backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Update User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser();
          }}
          className="space-y-6"
        >
          {/* User ID Input Field */}
          <div>
            <Label
              htmlFor="user_id"
              className="block text-sm font-bold text-foreground mb-2"
            >
              User ID
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="user_id"
                type="number"
                value={userId || ""}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                className="border border-white/20 text-foreground w-full rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                required
              />
              <Button
                onClick={() => handleUpdateUser()}
                className="px-4 py-2 text-white bg-theme-primary hover:bg-theme-primary-highlight rounded-md"
              >
                Fetch User
              </Button>
            </div>
          </div>

          {/* Fields for updating user */}
          {userId
            ? [
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
                  label: "Password",
                  value: password,
                  onChange: setPassword,
                  type: "text",
                  placeholder: "Enter password (optional)",
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
                    required={
                      label !== "Phone Number" && label !== "Date of Birth"
                    }
                  />
                </div>
              ))
            : "Select a user first"}

          {/* Admin and Guest Toggles */}
          {userId && (
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
          )}

          {/* Update User Button */}
          <Button
            type="submit"
            className="w-full bg-theme-primary hover:bg-theme-primary-highlight text-white font-semibold py-2 rounded-lg mt-4"
          >
            Update User
          </Button>
        </form>
      </div>
    </div>
  );
}
