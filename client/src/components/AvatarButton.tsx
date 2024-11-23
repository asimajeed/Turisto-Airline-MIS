import { FaUser } from "react-icons/fa";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { useGlobalStore } from "@/context/GlobalStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

// Avatar Component
const Avatar = () => {
  return <FaUser className="size-9 rounded-full overflow-hidden" />;
};

const AvatarButton = ({ onLogout }: { onLogout: () => void }) => {
  const { first_name, last_name } = useGlobalStore();
  const name = `${first_name} ${last_name}`;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="mt-1">
        <Avatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/user">
            <DropdownMenuItem>
              <IoSettingsOutline />
              Manage User
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onLogout}>
            <IoLogOutOutline /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarButton;
