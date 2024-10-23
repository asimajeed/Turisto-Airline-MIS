import { ReactNode } from "react";

type FullScreenProperties = {
  children: ReactNode;
  className?: string;
};
const FullscreenSection = ({ children, className = '' }: FullScreenProperties) => {
  return (
    <div className={"w-screen h-[calc(100vh-var(--navbar-height))]" + " " + className}>
      {children}
    </div>
  );
};

export default FullscreenSection;
