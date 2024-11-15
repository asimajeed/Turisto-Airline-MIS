import React, { useState, createContext } from "react";

export interface UserInfo {
  first_name: string;
  last_name: string;
  start_date: Date;
  end_date: Date;
  departure_airport: string;
  arrival_airport: string;
  adminAccess: boolean;
}

const UserInfoContext = createContext<{
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}>({
  user: null,
  setUser: () => {},
});

const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  return (
    <UserInfoContext.Provider value={{ user, setUser: setUser }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export { UserInfoContext, UserInfoProvider };
