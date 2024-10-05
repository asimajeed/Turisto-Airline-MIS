import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Purchase from "./pages/Purchase";
import HelloWorld from "./components/helloWorld/helloWorld";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import NavigationBar from "./components/NavigationBar/NavigationBar";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/helloworld" element={<HelloWorld />} />
          <Route
            path="*"
            element={
              <code className="flex items-center justify-center h-screen text-lg font-bold">
                404 Not Found
              </code>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
