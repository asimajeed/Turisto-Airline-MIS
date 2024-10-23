import NavigationBar from "./NavigationBar";

const Layout = ({ children }: any) => {
  return (
    <div>
      <NavigationBar />
      <div className="pt-[var(--navbar-height)]">
        {/* Add padding top to prevent content from being hidden behind the fixed navbar */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
