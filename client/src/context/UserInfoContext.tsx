import { createContext } from "react";

export interface UserInfo {
  name: string;
  phone: string;
  email: string;
  preferences: {
    seatPreference: string;
    mealPreference: string;
  };
  loyaltyPoints: number;
  pastBookings: Array<{
    bookingReference: string;
    flightDetails: string;
    date: string;
  }>;
  discountCodes: string[];
  adminAccess: boolean;
}

// Creates the context with a default value of `undefined`
// This will be updated later in the provider
const UserInfoContext = createContext<{
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}>({
  user: null,
  setUser: () => {},
});

export default UserInfoContext;
