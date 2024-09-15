import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Purchase from './pages/Purchase'
import HelloWorld from "./components/helloWorld/helloWorld";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/helloworld" element={<HelloWorld />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;