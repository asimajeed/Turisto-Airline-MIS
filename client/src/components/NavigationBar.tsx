// @ts-nocheck
import { useState, useEffect, ReactNode, forwardRef } from "react";
import LoginDialog from "@/components/LoginDialog/LoginDialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "@theme-toggles/react/css/Within.css";
import { Within } from "@theme-toggles/react";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import AvatarButton from "./AvatarButton";
import { useGlobalStore } from "@/context/GlobalStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NavBar = forwardRef<
  HTMLElement,
  { children?: ReactNode; className?: string }
>(({ children, className }, ref) => {
  const [popupFlag, setPopupFlag] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useGlobalStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { setAll } = useGlobalStore();
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };
  const handleLogout = () => {
    try {
      axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/user/logout`, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getLoggedIn = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/profile`,
          { withCredentials: true }
        );
        if (response.status == 200) {
          setIsLoggedIn(true);
          setAll({
            ...response.data,
            date_of_birth: new Date(response.data.date_of_birth),
          });
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    getLoggedIn();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const theme = useTheme();
  return (
    <>
      <nav
        className={cn(
          `fixed w-full h-[var(--navbar-height)] z-10 text-foreground transition-colors duration-200 ${
            isScrolled ? "bg-background bg-opacity-100" : "bg-transparent"
          }`,
          className
        )}
        ref={ref}
      >
        <div className="flex items-center justify-between h-full px-8">
          <Link to="/">
            <div className="text-3xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary text-transparent bg-clip-text">
              Turisto
            </div>
          </Link>

          <ul className="flex items-center justify-between h-full w-24">
            <Within
              duration={500}
              onToggle={() => theme.toggleTheme()}
              className="text-3xl transition-colors duration-500"
              style={{ color: `${theme.theme !== "dark" ? "black" : "white"}` }}
              toggled={theme.theme == "dark"}
            />
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {isLoggedIn ? (
                <AvatarButton onLogout={handleLogout} />
              ) : isLoggedIn !== undefined ? (
                <Button
                  onClick={() => setPopupFlag(true)}
                  className="bg-theme-primary hover:bg-theme-primary-highlight text-white ml-4"
                >
                  Sign In
                </Button>
              ) : (
                <div></div>
              )}
            </motion.div>
          </ul>
        </div>
        {children}
      </nav>
      <LoginDialog
        isOpen={popupFlag}
        setIsOpen={setPopupFlag}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={!!isLoggedIn}
      />
    </>
  );
});

export default NavBar;
