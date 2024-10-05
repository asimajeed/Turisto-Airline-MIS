import { useEffect, useState } from "react";
import "./HelloWorld.css";

const HelloWorld = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the message from the backend
    fetch("http://localhost:5000/test")
      .then((response) => {
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) =>
        setMessage(
          "Failed to fetch message from backend. Run the server to test message" + error
        )
      );
  }, []);

  return (
    <div className="flex h-screen">
      <div className="hello-world">
        <h1 className="hello-world-heading">Hello, World!</h1>
        <p className="hello-world-text">{message}</p>
      </div>
    </div>
  );
};

export default HelloWorld;
