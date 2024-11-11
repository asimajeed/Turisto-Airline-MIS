import React, { useState } from "react";
import UserInfoContext, { UserInfo } from "./UserInfoContext";


const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  return (
    <UserInfoContext.Provider value={{ user, setUser: setUser }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
