import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleRunQuery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/run-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard - SQL Terminal</h1>
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
