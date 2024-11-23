import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ManageDatabase from "./pages/admin/ManageDatabase";
import { Update } from "./pages/user/Update";
import Layout from "./components/Layout";
import FlightsTable from "./pages/FlightsTable";
import PassengerInfo from "./pages/PassengerInfo";
import BoardingPass from "./pages/BoardingPass";
import PassengerTicket from "./pages/PassengerTicket";
import PaymentPage from "./pages/Payment";
import { ThemeProvider } from "./context/ThemeContext";
import SDLayout from "./components/SDLayout";
import SDALayout from "./components/SDALayout";
import { ModifyFlight } from "./pages/user/ModifyFlight";
import { AddUser } from "./pages/admin/AddUser";
import History from "./pages/user/History"

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
                <BoardingPass />
            }
          />

          <Route
            path="/passengerticket"
            element={
                <PassengerTicket />
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
            <Route path="history" element={<History />} />
          </Route>
          <Route path="/admin" element={<SDALayout />}>
            <Route path="sql" element={<ManageDatabase />} />
            <Route path="add" element={<AddUser />} />
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
