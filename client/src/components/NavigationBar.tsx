import { useState, useEffect, SetStateAction } from "react";
import LoginDialog from "@/components/LoginForm/LoginForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "@theme-toggles/react/css/Within.css";
import { Within } from "@theme-toggles/react";
import { useTheme } from "@/context/ThemeContext";

const handleLogout = (setIsLoggedIn: {
  (value: SetStateAction<boolean>): void;
  (arg0: boolean): void;
}) => {
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

  const theme = useTheme();
  return (
    <>
      <nav
        className={`fixed w-full h-[var(--navbar-height)] z-10 text-foreground transition-colors duration-500 ${
          isScrolled ? "bg-background bg-opacity-100" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-full px-8">
          <Link to="/">
            <div className="text-3xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary text-transparent bg-clip-text">
              Turisto
            </div>
          </Link>

          <ul className="flex flex-row items-center h-full">
            <Within
              duration={500}
              onToggle={() => theme.toggleTheme()}
              className="text-3xl transition-colors duration-500"
              style={{ color: `${theme.theme !== "dark" ? "black" : "white"}` }}
              toggled={theme.theme == "dark"}
            />
            {isLoggedIn ? (
              <Button
                className="bg-theme-primary hover:bg-theme-primary-highlight text-white ml-4"
                onClick={() => handleLogout(setIsLoggedIn)}
              >
                Log out
              </Button>
            ) : (
              <Button
                onClick={() => setPopupFlag(true)}
                className="bg-theme-primary hover:bg-theme-primary-highlight text-white ml-4"
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
