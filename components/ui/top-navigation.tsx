import { useRole } from "@/utils/context/roleContext";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
const TopNavigation = () => {
  const { profile } = useRole();
  return (
    <nav className="flex absolute top-0 left-0 w-full justify-between items-center p-2 bg-transparent">
      <div className="flex justify-between items-center px-4 py-2 gap-2">
        <Avatar>
          <AvatarImage src={profile?.user_profile_picture ?? ""} />
          <AvatarFallback>
            <UserIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <p className="text-white text-sm font-bold">{profile?.user_username}</p>
      </div>
    </nav>
  );
};

export default TopNavigation;
