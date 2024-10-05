import { useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleRunQuery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/test/run-sql`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query,
      });
      const data = JSON.stringify(await res.json(), null, 2);
      setResponse(data);
    } catch (error) {
      setResponse(`Error: ${error}`);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="mt-16" >Admin Dashboard - SQL Terminal</h1>
      <form onSubmit={handleRunQuery}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter SQL command here"
          required
        />
        <button type="submit">Run Query</button>
      </form>
      <div className="response-container">
        <h3>Query Response:</h3>
        <code>{response}</code>
      </div>
    </div>
  );
};

export default AdminDashboard;
