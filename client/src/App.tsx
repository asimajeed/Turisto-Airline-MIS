import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import { Update } from "./pages/user/Update";
import Layout from "./components/Layout";
import FlightsTable from "./pages/FlightsTable";
import PassengerInfo from "./pages/PassengerInfo";
import BoardingPass from "./pages/BoardingPass";
import PassengerTicket from "./pages/PassengerTicket";
import PaymentPage from "./pages/Payment";
import { ThemeProvider } from "./context/ThemeContext";
import SDLayout from "./components/SDLayout";
import { ModifyFlight } from "./pages/user/ModifyFlight";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/passenger"
            element={
              <Layout>
                <PassengerInfo />
              </Layout>
            }
          />

          <Route
            path="/search"
            element={
              <Layout>
                <Search />
              </Layout>
            }
          />

          <Route
            path="/admin"
            element={
              <Layout>
                <Admin />
              </Layout>
            }
          />

          <Route
            path="/flights"
            element={
              <Layout>
                <FlightsTable />
              </Layout>
            }
          />

          <Route
            path="/boardingpass"
            element={
              <Layout>
                <BoardingPass />
              </Layout>
            }
          />

          <Route
            path="/passengerticket"
            element={
              <Layout>
                <PassengerTicket />
              </Layout>
            }
          />

          <Route
            path="/payment"
            element={
              <Layout>
                <PaymentPage />
              </Layout>
            }
          />
          <Route path="/user" element={<SDLayout />}>
            <Route path="update" element={<Update />} />
            <Route path="modify" element={<ModifyFlight />} />
          </Route>
          <Route
            path="*"
            element={
              <Layout>
                <div className="w-full h-[55vh]">
                  <code className="flex items-center justify-center h-full text-3xl font-bold">
                    404 Not Found
                  </code>
                </div>
              </Layout>
            }
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
