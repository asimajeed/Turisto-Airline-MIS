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
import { useGlobalStore } from "./context/GlobalStore";
import ErrorPage from "./pages/ErrorPage";
import History from "./pages/user/History"
import { UpdateUser } from "./pages/admin/UpdateUser";
import UpdateBooking from "./pages/admin/UpdateBooking"
import CreateFlight from "./pages/admin/CreateFlight";
import EditFlight from "./pages/admin/Editflight";

const App = () => {
  const { isLoggedIn, is_admin } = useGlobalStore();
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

          <Route path="/boardingpass" element={<BoardingPass />} />

          <Route path="/passengerticket" element={<PassengerTicket />} />

          <Route
            path="/payment"
            element={
              <Layout>
                <PaymentPage />
              </Layout>
            }
          />
          {isLoggedIn ? (
            <>
              <Route path="/user" element={<SDLayout />}>
                <Route path="update" element={<Update />} />
                <Route path="modify" element={<ModifyFlight />} />
                <Route path="history" element={<History />} />
              </Route>
              {is_admin ? (
                <Route path="/admin" element={<SDALayout />}>
                  <Route path="sql" element={<ManageDatabase />} />
                  <Route path="add" element={<AddUser />} />
                  <Route path="update" element={<UpdateUser />} />
                  <Route path="updateBook" element={<UpdateBooking />} />
                  <Route path="createflight" element={<CreateFlight />} />
                  <Route path="editflight" element={<EditFlight />} />
                </Route>
              ) : (
                <>
                  <Route
                    path="/admin"
                    element={<ErrorPage message="401 Unauthorized" />}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Route
                path="/user"
                element={<ErrorPage message="401 Unauthorized" />}
              />
              <Route
                path="/admin"
                element={<ErrorPage message="401 Unauthorized" />}
              />
            </>
          )}

          <Route path="*" element={<ErrorPage message="404 Not Found" />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
