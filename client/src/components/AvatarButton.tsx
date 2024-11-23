import { FaUser, FaUserCog } from "react-icons/fa";
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
const Avatar = ({ admin }: { admin?: boolean }) => {
  if (admin) {
    return <FaUserCog className="size-9 rounded-full overflow-hidden" />;
  }
  return <FaUser className="size-9 rounded-full overflow-hidden" />;
};

const AvatarButton = ({ onLogout }: { onLogout: () => void }) => {
  const { first_name, last_name, is_admin } = useGlobalStore();
  const name = `${first_name} ${last_name}`;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="mt-1">
        {is_admin ? <Avatar admin /> : <Avatar />}
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
          {is_admin ? (
            <Link to="/admin">
              <DropdownMenuItem>
                <IoSettingsOutline />
                Admin Dashboard
              </DropdownMenuItem>
            </Link>
          ) : (
            ""
          )}
          <DropdownMenuItem onClick={onLogout}>
            <IoLogOutOutline /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarButton;
