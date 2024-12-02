import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaRegCheckCircle } from "react-icons/fa";
import LoginForm from "./LoginFormBody";
import RegisterForm from "./RegisterFormBody";
import axios, { AxiosError } from "axios";
import { useGlobalStore } from "@/context/GlobalStore";

interface LoginFormProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoggedIn: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const LoginDialog = ({
  setIsLoggedIn,
  isLoggedIn,
  isOpen,
  setIsOpen,
}: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const feedbackPRef = useRef<HTMLParagraphElement>(null);
  const { setAll } = useGlobalStore();
  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };
  const showFeedback = (f: string, e?: string) => {
    if (feedbackPRef.current) feedbackPRef.current.style.color = "lawngreen";
    if (e)
      if (feedbackPRef.current) feedbackPRef.current.style.color = "orange";
    setFeedback(f);
  };
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || password.length < 6) {
      showFeedback(
        "Please fill all fields and use a password at least 6 characters long.",
        "err"
      );
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/register`,
        { firstName, lastName, email, password }
      );

      if (response.status === 201) {
        if (feedbackPRef.current) {
          feedbackPRef.current.style.color = "lawngreen";
        }
        showFeedback("User registered successfully!");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          if (error.response.status === 400) {
            showFeedback("User already exists.", "err");
          } else {
            showFeedback("Error registering user.", "err");
          }
        } else if (error.request) {
          showFeedback("Network error. Please try again.", "err");
        }
      } else {
        showFeedback("An unexpected error occurred.", "err");
        console.error(error);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      showFeedback("Login successful!");
      setAll({
        ...response.data,
        date_of_birth: new Date(response.data.date_of_birth),
      });
      console.log(response.data);
      setIsLoggedIn(true);
      setIsOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          if (error.response.status === 401) {
            showFeedback("Invalid email or password.", "err");
          } else {
            showFeedback("Login failed.", "err");
          }
        } else if (error.request) {
          showFeedback("Network error. Please try again.", "err");
        }
      } else {
        showFeedback("An unexpected error occurred.", "err");
        console.error(error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white/30 backdrop-blur-lg border border-white/30 px-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className=" text-white">
            {activeTab === "login" ? "Login" : "Register"}
          </DialogTitle>
          <DialogDescription className=" text-white">
            Select the tab to switch between login and register
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <button
            className={`w-full py-2 text-center rounded font-semibold ${
              activeTab === "login"
                ? "bg-theme-primary-darker text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => toggleTab("login")}
          >
            Login
          </button>
          <button
            className={`w-full py-2 text-center rounded font-semibold ${
              activeTab === "register"
                ? "bg-theme-primary-darker text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => toggleTab("register")}
          >
            Register
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
            toggleTab={toggleTab}
          />
        ) : (
          <RegisterForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSignUp={handleSignUp}
          />
        )}
        {isLoggedIn && (
          <div className="text-green-700 flex flex-row justify-center">
            <FaRegCheckCircle size={32} />
          </div>
        )}
        <p ref={feedbackPRef} className="text-center mt-2 text-white">
          {feedback}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
