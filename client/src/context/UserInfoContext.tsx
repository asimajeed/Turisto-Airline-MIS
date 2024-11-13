import { createContext } from "react";

export interface UserInfo {
  first_name: string,
  last_name: string,
  start_date: Date,
  end_date: Date | null,
  adminAccess: boolean,
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
