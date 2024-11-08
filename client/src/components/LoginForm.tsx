import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FaRegCheckCircle } from "react-icons/fa";

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.message);
      } else {
        setFeedback("Error registering user.");
      }
    } catch (err){
      setFeedback("Network error.");
      console.log(err);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.message);
        setIsLoggedIn(true);
        setIsOpen(false); // Close the dialog after successful login
      } else {
        setFeedback("Login failed.");
      }
    } catch {
      setFeedback("Network error.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white/30 backdrop-blur-lg border border-white/30 px-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>{activeTab === "login" ? "Login" : "Register"}</DialogTitle>
          <DialogDescription>
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

const LoginFormBody = ({
  email,
  password,
  setEmail,
  setPassword,
  handleSignIn,
  toggleTab,
}: {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignIn: () => void;
  toggleTab: (tab: string) => void;
}) => (
  <>
    <FormInput label="Email address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
    <FormInput label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
    <div className="flex justify-between mb-4">
      <label className="flex items-center text-white">
        <input type="checkbox" className="mr-2" />
        Remember me
      </label>
      <a href="#!" onClick={() => alert("Good luck bozo")} className="text-white">
        Forgot password?
      </a>
    </div>
    <button className="w-full py-2 text-white bg-slate-900 rounded font-semibold" onClick={handleSignIn}>
      Sign in
    </button>
    <p className="text-center mt-4 text-slate-100">
      Not a member?{" "}
      <button className="text-white font-semibold" onClick={() => toggleTab("register")}>
        Register
      </button>
    </p>
  </>
);

const RegisterFormBody = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleSignUp,
}: {
  name: string;
  email: string;
  password: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignUp: () => void;
}) => (
  <>
    <FormInput label="Name" type="text" value={name} onChange={(e: any) => setName(e.target.value)} />
    <FormInput label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
    <FormInput label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
    <label className="flex items-center mb-4 text-white">
      <input type="checkbox" className="mr-2" />
      I have read and agree to the terms
    </label>
    <button className="w-full py-2 text-white bg-slate-900 rounded font-semibold" onClick={handleSignUp}>
      Sign up
    </button>
  </>
);

const FormInput = ({ label, type, value, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-white mb-2">{label}</label>
    <input type={type} value={value} onChange={onChange} className="w-full border border-gray-300 rounded p-2" required />
  </div>
);

export default LoginForm;
