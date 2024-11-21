import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

const Layout = ({ children }: any) => {
  return (
    <>
      <NavigationBar />
      {/* <div className="pt-[var(--navbar-height)]"> */}
      {/* Add padding top to prevent content from being hidden behind the fixed navbar */}
        {children}
      {/* </div> */}
      <Footer />
    </>
  );
};

export default Layout;
