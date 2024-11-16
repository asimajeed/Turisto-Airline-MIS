import React, { useState, createContext, useContext } from "react";

export interface UserInfoType {
  first_name: string | null;
  last_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  departure_airport: string | null;
  arrival_airport: string | null;
  airport_list: string[] | null;
  adminAccess: boolean;
}

const UserContext = createContext<{
  user: UserInfoType | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType | null>>;
}>({
  user: null,
  setUserInfo: () => {},
});

const UserInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfoType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUserInfo: setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export { UserInfoProvider, useUserContext };
