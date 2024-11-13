import { useState, useEffect, SetStateAction } from "react";
import LoginDialog from "@/components/LoginForm/LoginForm";
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

const handleLogout = (setIsLoggedIn: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  document.cookie = "token=; Max-Age=0";
  setIsLoggedIn(false);
};

const MyNavbar = () => {
  const [popupFlag, setPopupFlag] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll event listener to toggle navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Threshold for background change
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full h-[var(--navbar-height)] z-10 text-white transition-colors duration-300 ${isScrolled ? "bg-slate-50 bg-opacity-100" : "bg-transparent"
          }`}
      >
        <div className="flex items-center justify-between h-full px-8">
          <Link to="/">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600  text-transparent bg-clip-text">
              Turistoe
            </div>
          </Link>
          <ul className="flex flex-row items-center h-full">
            <Menubar className="bg-transparent text-purple-950 border-none">
              <MenubarMenu>
                <Link to="/admin">
                  <MenubarTrigger className="hover:bg-purple-50"> Admin </MenubarTrigger>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="hover:bg-purple-50">Flights</MenubarTrigger>
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
                <MenubarTrigger className="hover:bg-purple-50">Hotels</MenubarTrigger>
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
                className="bg-purple-600 hover:bg-purple-700 text-white ml-4"
                onClick={() => handleLogout(setIsLoggedIn)}
              >
                Log out
              </Button>
            ) : (
              <Button
                onClick={() => setPopupFlag(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white ml-4"
              >
                Sign In
              </Button>
            )}
          </ul>
        </div>
      </nav>
      <LoginDialog
        isOpen={popupFlag}
        setIsOpen={setPopupFlag}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
};

export default MyNavbar;
