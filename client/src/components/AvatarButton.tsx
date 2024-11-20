import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import axios from "axios";
import { SetStateAction } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

interface AvatarButtonProps {
  handleLogout: (setIsLoggedIn: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }) => void;
}

const AvatarButton = (props: AvatarButtonProps) => {
  const { data, setContext } = useGlobalContext();
  let name = `${data.first_name} ${data.last_name}`;
  if (name.length>13)
  name = name.substring(0, 13) + '...';
  return (
    <div className="flex justify-between content-center">
      <FaUser className="size-8 rounded-full overflow-hidden" />
      <p>{name}</p>
    </div>
  );
};

export default AvatarButton;
