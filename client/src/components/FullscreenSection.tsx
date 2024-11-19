import { ReactNode } from "react";

type FullScreenProperties = {
  children: ReactNode;
  className?: string;
};
const FullscreenSection = ({ children, className = '' }: FullScreenProperties) => {

  // h-[calc(100vh-var(--navbar-height))]
  return (
    <div className={"w-max-[100vw]" + " " + className}>
      {children}
    </div>
  );
};

export default FullscreenSection;
