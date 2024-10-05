import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

function LoginForm(props) {
  const [activeTab, setActiveTab] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
        // reset the form or provide user feedback
      } else {
        console.error("Error registering user", await response.text());
      }
    } catch (error) {
      console.error("", error);
      setFeedback("Network error.");
    }
  };
  async function handleSignIn() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.message);
        props.setIsLoggedIn(true);
      } else {
        console.log(response);
        setFeedback(await response.text());
      }
    } catch (err) {
      setFeedback("Network error.");
      console.log(err);
    }
  }

  return (
    <div className="flex pointer-events-none items-center justify-center min-h-screen">
      <div
        className={`bg-white p-8 rounded-lg shadow-lg w-96 ${props.showFlag ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {!props.isLoggedIn && (
          <div className="flex justify-between mb-4">
            <button
              className={`w-full py-2 text-center rounded ${activeTab === "login" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => toggleTab("login")}
            >
              Login
            </button>
            <button
              className={`w-full py-2 text-center rounded ${activeTab === "register" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => toggleTab("register")}
            >
              Register
            </button>
          </div>
        )}

        {activeTab === "login" && !props.isLoggedIn && (
          <div>
            <FormInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a onClick={() => alert("Good luck bozo")} href="#!" className="text-blue-600">
                Forgot password?
              </a>
            </div>
            <button
              className="w-full py-2 text-white bg-blue-500 rounded"
              onClick={handleSignIn}
            >
              Sign in
            </button>
            <p className="text-center mt-4">
              Not a member?{" "}
              <button className="text-blue-600" onClick={() => toggleTab("register")}>
                Register
              </button>
            </p>
          </div>
        )}

        {activeTab === "register" && !props.isLoggedIn && (
          <div>
            <FormInput
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />I have read and agree to the terms
            </label>
            <button
              className="w-full py-2 text-white bg-blue-500 rounded"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </div>
        )}

        {props.isLoggedIn && (
          <div className="text-green-700 flex flex-row justify-center">
            <FaRegCheckCircle size={32} />
          </div>
        )}
        <p className="text-center mt-2">{feedback}</p>
      </div>
    </div>
  );
}

const FormInput = ({ label, type, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded p-2"
      required
    />
  </div>
);
const LoginFormPopup = (props) => {
  return (
    <>
      <div
        onClick={() => props.flagSetter(false)}
        className={`fixed h-screen w-screen z-20 transition-opacity ease-in duration-300 ${props.flag ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(0,0,0,0.33)" }}
      ></div>
      <div
        className={`fixed h-screen w-screen z-20 pointer-events-none transition-opacity ease-in duration-300 ${props.flag ? "opacity-100" : "opacity-0"}`}
      >
        <LoginForm
          showFlag={props.flag}
          setIsLoggedIn={props.setIsLoggedIn}
          isLoggedIn={props.isLoggedIn}
        />
      </div>
    </>
  );
};

export default LoginFormPopup;
