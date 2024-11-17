import FullscreenSection from "@/components/FullscreenSection";
import { Card } from "@/components/ui/card";
import { useState } from "react";
// import SDLayout from "@/components/SDLayout";

const AdminDashboard = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleQueryRun = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/admin/sql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      console.log(JSON.stringify({ query }));
      const responseJSON = await res.json();
      const data = JSON.parse(JSON.stringify(responseJSON));
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Client error: ${error}`);
    }
  };

  return (
    //<SDLayout>
    <FullscreenSection className="flex justify-center items-center ">
      <Card className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Admin Dashboard - SQL Terminal</h1>

        <form onSubmit={handleQueryRun} className="space-y-4">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter SQL command here"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Run Query
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Query Response:</h3>
          <textarea
            className="w-full h-60 p-4 bg-gray-100 border border-gray-300 rounded-lg resize-none"
            value={response}
            readOnly
          />
        </div>
      </Card>
      </FullscreenSection>
    //</SDLayout>
  );
};
export default AdminDashboard;
