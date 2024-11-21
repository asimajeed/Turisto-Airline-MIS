import { useState, useEffect, SetStateAction } from "react";
import LoginDialog from "@/components/LoginDialog/LoginDialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "@theme-toggles/react/css/Within.css";
import { Within } from "@theme-toggles/react";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import AvatarButton from "./AvatarButton";
import { useGlobalContext } from "@/context/GlobalContext";
import { motion } from "framer-motion";
const handleLogout = (setIsLoggedIn: {
  (value: SetStateAction<boolean>): void;
  (arg0: boolean): void;
}) => {
  try {
    axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/logout`);
    setIsLoggedIn(false);
  } catch (error) {
    // do something
  }
};

const MyNavbar = () => {
  const [popupFlag, setPopupFlag] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, setContext } = useGlobalContext();
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
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
          setContext(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    getLoggedIn();
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
        <div className="flex items-center justify-between h-full pl-8">
          <Link to="/">
            <div className="text-3xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary text-transparent bg-clip-text">
              Turisto
            </div>
          </Link>

          <ul className="flex items-center justify-between h-full w-32">
            <Within
              duration={500}
              onToggle={() => theme.toggleTheme()}
              className="text-3xl transition-colors duration-500"
              style={{ color: `${theme.theme !== "dark" ? "black" : "white"}` }}
              toggled={theme.theme == "dark"}
            />
            {isLoggedIn ? (
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <AvatarButton handleLogout={handleLogout}></AvatarButton>
              </motion.div>
            ) : (
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Button
                  onClick={() => setPopupFlag(true)}
                  className="bg-theme-primary hover:bg-theme-primary-highlight text-white ml-4"
                >
                  Sign In
                </Button>
              </motion.div>
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
