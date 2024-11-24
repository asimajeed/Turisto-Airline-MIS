import { Card } from "@/components/ui/card";
import axios from "axios";
import { useState } from "react";

const renderTable = (rows: any[]) => {
  if (rows.length === 0) {
    return <p>No results found.</p>;
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="overflow-scroll max-h-[50vh]">
      <table className="text-foreground min-w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border p-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="border p-2">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManageDatabase = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQueryRun = async (e: any) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const responseJSON = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/admin/sql`,
        { query },
        { withCredentials: true }
      );
      const data = responseJSON.data;
      
      if (data?.rows) {
        setResponse({ type: "select", data: data.rows });
      } else if (data?.rowCount !== undefined) {
        setResponse({
          type: "crud",
          message: `${data.rowCount} row(s) affected`,
        });
      } else {
        setResponse({ type: "error", message: "Unexpected response format" });
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (error.response) {
      setError(
        `Server error: ${error.response.data?.message || error.response.statusText}`
      );
    } else if (error.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError(`Client error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setQuery("");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="max-w-[100vw] flex justify-center items-center text-black">
      <Card className="w-full max-w-4xl p-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Admin Dashboard - SQL Terminal
        </h1>

        <form onSubmit={handleQueryRun} className="space-y-4">
          <textarea
            className="w-full bg-card text-foreground h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter SQL command here"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Run Query
          </button>
          <button
            type="button"
            className="w-full bg-red-500 hover:bg-red-600 text-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            onClick={resetForm}
          >
            Reset
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Query Response:
          </h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : response ? (
            response.type === "select" ? (
              renderTable(response.data)
            ) : response.type === "crud" ? (
              <p>{response.message}</p>
            ) : (
              <p className="text-red-500">{response.message}</p>
            )
          ) : (
            <p>No response yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageDatabase;
