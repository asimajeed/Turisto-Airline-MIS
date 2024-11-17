import React, { useState, createContext, useContext } from "react";
import { airportType } from "@/utils/types";
export interface UserInfoType {
  first_name: string | null;
  last_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  departure_airport: airportType | null;
  arrival_airport: airportType | null;
  airport_list: string[] | null;
  adminAccess: boolean;
}

const UserContext = createContext<{
  user: UserInfoType;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>>;
}>({
  user: {
    first_name: null,
    last_name: null,
    start_date: null,
    end_date: null,
    departure_airport: null,
    arrival_airport: null,
    airport_list: null,
    adminAccess: false
  },
  setUserInfo: () => {},
});

const UserInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfoType>(useContext(UserContext).user);

  return (
    <UserContext.Provider value={{ user, setUserInfo: setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export { UserInfoProvider, useUserContext };
