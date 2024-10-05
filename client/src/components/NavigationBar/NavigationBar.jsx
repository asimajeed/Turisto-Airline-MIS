import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginMenu from "../LoginForm";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedToken.exp < currentTime;
};

const handleLogout = (setIsLoggedIn) => {
  document.cookie = "token=; Max-Age=0";
  setIsLoggedIn(false);
};

const MyNavbar = () => {
  const [popupFlag, setPopupFlag] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(token && !isTokenExpired(token));
  }, []);
  return (
    <>
      <nav className="bg-gray-800 fixed w-full h-16 z-10 shadow-md text-white">
        <div className="container flex items-center justify-between h-full">
          <div className="text-lg mx-8 font-bold">Turistoe</div>
          <ul className="flex flex-row items-center h-full">
            <button className="px-6 h-full hover:bg-gray-900 transition-colors ">
              <Link to="/">Home</Link>
            </button>
            {isLoggedIn ? (
              <button
                className="px-6 h-full hover:bg-gray-900 transition-colors"
                onClick={() => handleLogout(setIsLoggedIn)}
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => setPopupFlag(true)}
                className="px-6 h-full hover:bg-gray-900 transition-colors"
              >
                Login
              </button>
            )}
          </ul>
        </div>
      </nav>
      <LoginMenu flagSetter={setPopupFlag} flag={popupFlag} setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn } />
    </>
  );
};

export default MyNavbar;
