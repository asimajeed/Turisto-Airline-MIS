import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
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
import BookingHistory from "./pages/user/BookingHistory";
import { UpdateUser } from "./pages/admin/UpdateUser";
import UpdateBooking from "./pages/admin/UpdateBooking";
import CreateFlight from "./pages/admin/CreateFlight";
import EditFlight from "./pages/admin/EditFlight";
import Report from "./pages/admin/Report";

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
              path="passenger"
              element={
                <Layout>
                  <PassengerInfo />
                </Layout>
              }
            />

            <Route
              path="flights"
              element={
                <Layout>
                  <FlightsTable />
                </Layout>
              }
            />

            <Route path="boardingpass" element={<BoardingPass />} />

            <Route
              path="passengerticket/:bookingId"
              element={<PassengerTicket />}
            />

            <Route
              path="payment"
              element={
                <Layout>
                  <PaymentPage />
                </Layout>
              }
            />
            {isLoggedIn ? (
              <>
                <Route path="user" element={<SDLayout />}>
                  <Route path="" element={<Update />} />
                  <Route path="modify" element={<ModifyFlight />} />
                  <Route path="history" element={<BookingHistory />} />
                </Route>
                {is_admin ? (
                  <Route path="admin" element={<SDALayout />}>
                    <Route path="sql" element={<ManageDatabase />} />
                    <Route path="" element={<AddUser />} />
                    <Route path="update" element={<UpdateUser />} />
                    <Route path="updateBook" element={<UpdateBooking />} />
                    <Route path="createflight" element={<CreateFlight />} />
                    <Route path="editflight" element={<EditFlight />} />
                    <Route path="report" element={<Report />} />
                  </Route>
                ) : (
                  <>
                    <Route
                      path="admin"
                      element={<ErrorPage message="401 Unauthorized" />}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <Route
                  path="user"
                  element={<ErrorPage message="401 Unauthorized" />}
                />
                <Route
                  path="admin"
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
