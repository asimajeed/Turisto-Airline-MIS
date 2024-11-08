import { useState, useEffect } from "react";
import LoginFormPopup from "./LoginForm";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const isTokenExpired = (token: string) => {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedToken.exp < currentTime;
};

const handleLogout = (setIsLoggedIn: any) => {
  document.cookie = "token=; Max-Age=0";
  setIsLoggedIn(false);
};

const MyNavbar = () => {
  const [popupFlag, setPopupFlag] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(Boolean(token && !isTokenExpired(token)));
  }, []);
  return (
    <>
      <nav className="bg-slate-300 bg-opacity-10 fixed w-full h-[var(--navbar-height)] z-10 shadow-md text-white">
        <div className="flex items-center justify-between h-full">
          <Link to="/">
            <div className="text-3xl mx-8 font-bold bg-gradient-to-r from-gray-300 to-zinc-500 text-transparent bg-clip-text">
              Turistoe
            </div>
          </Link>
          <ul className="flex flex-row items-center h-full">
            <Menubar className="bg-transparent text-white border-none">
              <MenubarMenu>
                <Link to="/admin">
                  <MenubarTrigger className="hover:bg-zinc-600"> Admin </MenubarTrigger>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-zinc-600">Flights</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-zinc-600">Hotels</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-zinc-600">Packages</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            {isLoggedIn ? (
              <Button
                className="bg-zinc-600 hover:bg-zinc-700 text-white"
                onClick={() => handleLogout(setIsLoggedIn)}
              >
                Log out
              </Button>
            ) : (
              <Button
                onClick={() => setPopupFlag(true)}
                className="bg-zinc-600 hover:bg-zinc-700 text-white"
              >
                Sign In
              </Button>
            )}
          </ul>
        </div>
      </nav>
      <LoginFormPopup
        isOpen={popupFlag}
        setIsOpen={setPopupFlag}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
};

export default MyNavbar;
