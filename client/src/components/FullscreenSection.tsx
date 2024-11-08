import { ReactNode } from "react";

type FullScreenProperties = {
  children: ReactNode;
  className?: string;
};
const FullscreenSection = ({ children, className = '' }: FullScreenProperties) => {

  // h-[calc(100vh-var(--navbar-height))]
  return (
    <div className={"w-screen h-screen" + " " + className}>
      {children}
    </div>
  );
};

export default FullscreenSection;
