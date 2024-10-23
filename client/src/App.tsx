import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Purchase from "./pages/Purchase";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import HomePage from "./components/HomePage/HomePage";
import Layout from "./components/Layout";
import FullscreenSection from "./components/FullscreenSection";
import FlightsTable from "./pages/FlightsTable";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/oldhome" element={<HomePage />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/flights" element={<FlightsTable />} />
            <Route
              path="*"
              element={
                <FullscreenSection>
                  <code className="flex items-center justify-center h-full text-3xl font-bold">
                    404 Not Found
                  </code>
                </FullscreenSection>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
};

export default App;
