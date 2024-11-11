import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FaRegCheckCircle } from "react-icons/fa";
import LoginFormBody from "./LoginFormBody";
import RegisterFormBody from "./RegisterFormBody";

interface LoginFormProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoggedIn: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const LoginForm = ({ setIsLoggedIn, isLoggedIn, isOpen, setIsOpen }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (response.status === 201) {
        setFeedback('User registered successfully!');
      } else if (response.status === 400) {
        setFeedback('User already exists.');
      } else {
        setFeedback('Error registering user.');
      }
    } catch (err) {
      setFeedback('Network error.');
      console.log(err);
    }
  };
  
  const handleSignIn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      if (response.ok) {
        setFeedback('Login successful!');
        setIsLoggedIn(true);
        setIsOpen(false); // Close the dialog after successful login
      } else if (response.status === 401) {
        setFeedback('Invalid email or password.');
      } else {
        setFeedback('Login failed.');
      }
    } catch {
      setFeedback('Network error.');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white/30 backdrop-blur-lg border border-white/30 px-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className=" text-white">{activeTab === "login" ? "Login" : "Register"}</DialogTitle>
          <DialogDescription className=" text-white">
            Select the tab to switch between login and register
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <button
            className={`w-full py-2 text-center rounded font-semibold ${
              activeTab === "login" ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => toggleTab("login")}
          >
            Login
          </button>
          <button
            className={`w-full py-2 text-center rounded font-semibold ${
              activeTab === "register" ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => toggleTab("register")}
          >
            Register
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginFormBody
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
            toggleTab={toggleTab}
          />
        ) : (
          <RegisterFormBody
            name={name}
            email={email}
            password={password}
            setName={setName}
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
        <p className="text-center mt-2 text-red-500">{feedback}</p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
