import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import { UserPage } from "./pages/UserPage";
import Layout from "./components/Layout";
import FullscreenSection from "./components/FullscreenSection";
import FlightsTable from "./pages/FlightsTable";
import PassengerInfo from "./pages/PassengerInfo";
import BoardingPass from "./pages/BoardingPass";
import PassengerTicket from "./pages/PassengerTicket";
import PaymentPage from "./pages/Payment";
import { ThemeProvider } from "./context/ThemeContext";
import { GlobalContextProvider } from "./context/GlobalContext";

const App = () => {
  return (
    // <BrowserRouter>
    //   <ThemeProvider>
    //     <GlobalContextProvider>
    //       <Layout>
    //         <Routes>
    //           <Route path="/" element={<Home />} />
    //           <Route path="/passenger" element={<PassengerInfo />} />
    //           <Route path="/search" element={<Search />} />
    //           <Route path="/admin" element={<Admin />} />
    //           <Route path="/flights" element={<FlightsTable />} />
    //           <Route path="/boardingpass" element={<BoardingPass />} />
    //           <Route path="/passengerticket" element={<PassengerTicket />} />
    //           <Route path="/payment" element={<PaymentPage />} />
    //           {/* <Route path="/userpage" element={<UserPage />} /> */}
    //           <Route
    //             path="*"
    //             element={
    //               <FullscreenSection>
    //                 <code className="flex items-center justify-center h-full text-3xl font-bold">
    //                   404 Not Found
    //                 </code>
    //               </FullscreenSection>
    //             }
    //           />
    //         </Routes>
    //       </Layout>
    //     </GlobalContextProvider>
    //   </ThemeProvider>
    // </BrowserRouter>

    <UserPage/>
  );
};

export default App;
